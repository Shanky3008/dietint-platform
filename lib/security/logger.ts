// Comprehensive API request logging and monitoring system
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getDatabaseAdapter } from '../database';

export interface LogEntry {
  id?: string;
  timestamp: string;
  method: string;
  url: string;
  userAgent?: string;
  ip: string;
  userId?: string;
  statusCode?: number;
  responseTime?: number;
  requestSize?: number;
  responseSize?: number;
  error?: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  metadata?: Record<string, any>;
}

export interface LoggerConfig {
  enableFileLogging?: boolean;
  enableDatabaseLogging?: boolean;
  enableConsoleLogging?: boolean;
  logDirectory?: string;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  sensitiveFields?: string[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export class Logger {
  private config: Required<LoggerConfig>;
  private logLevels = { debug: 0, info: 1, warn: 2, error: 3 };

  constructor(config: LoggerConfig = {}) {
    this.config = {
      enableFileLogging: true,
      enableDatabaseLogging: true,
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      logDirectory: path.join(process.cwd(), 'logs'),
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      sensitiveFields: ['password', 'token', 'apiKey', 'secret', 'creditCard'],
      logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      ...config,
    };

    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (this.config.enableFileLogging && !fs.existsSync(this.config.logDirectory)) {
      fs.mkdirSync(this.config.logDirectory, { recursive: true });
    }
  }

  private shouldLog(level: string): boolean {
    return this.logLevels[level as keyof typeof this.logLevels] >= 
           this.logLevels[this.config.logLevel];
  }

  private sanitizeData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (this.config.sensitiveFields.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      )) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private async writeToFile(entry: LogEntry) {
    if (!this.config.enableFileLogging) return;

    const filename = `${new Date().toISOString().split('T')[0]}.log`;
    const filepath = path.join(this.config.logDirectory, filename);
    const logLine = JSON.stringify(entry) + '\n';

    try {
      // Check file size and rotate if necessary
      if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        if (stats.size > this.config.maxFileSize) {
          await this.rotateLogFile(filepath);
        }
      }

      fs.appendFileSync(filepath, logLine);
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }

  private async rotateLogFile(filepath: string) {
    const dir = path.dirname(filepath);
    const basename = path.basename(filepath, '.log');
    
    // Find existing rotated files
    const files = fs.readdirSync(dir)
      .filter(f => f.startsWith(basename) && f.endsWith('.log'))
      .sort()
      .reverse();

    // Remove oldest files if we exceed maxFiles
    while (files.length >= this.config.maxFiles) {
      const oldestFile = files.pop();
      if (oldestFile) {
        fs.unlinkSync(path.join(dir, oldestFile));
      }
    }

    // Rotate current file
    const rotatedName = `${basename}.${Date.now()}.log`;
    fs.renameSync(filepath, path.join(dir, rotatedName));
  }

  private async writeToDatabase(entry: LogEntry) {
    if (!this.config.enableDatabaseLogging) return;

    try {
      const db = await getDatabaseAdapter();
      
      // Create logs table if it doesn't exist
      await db.exec(`
        CREATE TABLE IF NOT EXISTS api_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          method TEXT NOT NULL,
          url TEXT NOT NULL,
          user_agent TEXT,
          ip TEXT NOT NULL,
          user_id TEXT,
          status_code INTEGER,
          response_time INTEGER,
          request_size INTEGER,
          response_size INTEGER,
          error TEXT,
          level TEXT NOT NULL,
          metadata TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.run(`
        INSERT INTO api_logs (
          timestamp, method, url, user_agent, ip, user_id, 
          status_code, response_time, request_size, response_size, 
          error, level, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        entry.timestamp,
        entry.method,
        entry.url,
        entry.userAgent,
        entry.ip,
        entry.userId,
        entry.statusCode,
        entry.responseTime,
        entry.requestSize,
        entry.responseSize,
        entry.error,
        entry.level,
        entry.metadata ? JSON.stringify(entry.metadata) : null,
      ]);
    } catch (error) {
      console.error('Failed to write log to database:', error);
    }
  }

  private writeToConsole(entry: LogEntry) {
    if (!this.config.enableConsoleLogging) return;

    const message = `[${entry.timestamp}] ${entry.level.toUpperCase()} ${entry.method} ${entry.url}`;
    const details = {
      ip: entry.ip,
      userId: entry.userId,
      statusCode: entry.statusCode,
      responseTime: entry.responseTime,
      error: entry.error,
    };

    switch (entry.level) {
      case 'error':
        console.error(message, details);
        break;
      case 'warn':
        console.warn(message, details);
        break;
      case 'debug':
        console.debug(message, details);
        break;
      default:
        console.log(message, details);
    }
  }

  async log(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;

    const sanitizedEntry = {
      ...entry,
      metadata: entry.metadata ? this.sanitizeData(entry.metadata) : undefined,
    };

    // Write to all configured outputs
    await Promise.all([
      this.writeToFile(sanitizedEntry),
      this.writeToDatabase(sanitizedEntry),
      Promise.resolve(this.writeToConsole(sanitizedEntry)),
    ]);
  }

  async info(message: string, metadata?: Record<string, any>) {
    await this.log({
      timestamp: new Date().toISOString(),
      method: '',
      url: '',
      ip: '',
      level: 'info',
      error: message,
      metadata,
    });
  }

  async warn(message: string, metadata?: Record<string, any>) {
    await this.log({
      timestamp: new Date().toISOString(),
      method: '',
      url: '',
      ip: '',
      level: 'warn',
      error: message,
      metadata,
    });
  }

  async error(message: string, error?: Error, metadata?: Record<string, any>) {
    await this.log({
      timestamp: new Date().toISOString(),
      method: '',
      url: '',
      ip: '',
      level: 'error',
      error: error ? `${message}: ${error.message}` : message,
      metadata: {
        ...metadata,
        ...(error && { stack: error.stack }),
      },
    });
  }

  async debug(message: string, metadata?: Record<string, any>) {
    await this.log({
      timestamp: new Date().toISOString(),
      method: '',
      url: '',
      ip: '',
      level: 'debug',
      error: message,
      metadata,
    });
  }

  // Get logs from database
  async getLogs(filters: {
    startDate?: string;
    endDate?: string;
    method?: string;
    level?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      const db = await getDatabaseAdapter();
      
      let query = 'SELECT * FROM api_logs WHERE 1=1';
      const params: any[] = [];

      if (filters.startDate) {
        query += ' AND timestamp >= ?';
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        query += ' AND timestamp <= ?';
        params.push(filters.endDate);
      }

      if (filters.method) {
        query += ' AND method = ?';
        params.push(filters.method);
      }

      if (filters.level) {
        query += ' AND level = ?';
        params.push(filters.level);
      }

      if (filters.userId) {
        query += ' AND user_id = ?';
        params.push(filters.userId);
      }

      query += ' ORDER BY timestamp DESC';

      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }

      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }

      const logs = await db.query(query, params);
      return logs.map((log: any) => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      }));
    } catch (error) {
      console.error('Failed to get logs from database:', error);
      return [];
    }
  }

  // Get log statistics
  async getLogStats(filters: {
    startDate?: string;
    endDate?: string;
  } = {}) {
    try {
      const db = await getDatabaseAdapter();
      
      let query = `
        SELECT 
          level,
          COUNT(*) as count,
          AVG(response_time) as avg_response_time,
          MAX(response_time) as max_response_time
        FROM api_logs 
        WHERE 1=1
      `;
      const params: any[] = [];

      if (filters.startDate) {
        query += ' AND timestamp >= ?';
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        query += ' AND timestamp <= ?';
        params.push(filters.endDate);
      }

      query += ' GROUP BY level';

      const stats = await db.query(query, params);
      return stats;
    } catch (error) {
      console.error('Failed to get log stats:', error);
      return [];
    }
  }
}

// Request logging middleware
export function requestLogger(config?: LoggerConfig) {
  const logger = new Logger(config);
  
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const startTime = Date.now();
    const originalSend = res.send;
    const originalJson = res.json;
    
    let responseSize = 0;
    
    // Override response methods to capture size
    res.send = function(body: any) {
      responseSize = Buffer.byteLength(body || '', 'utf8');
      return originalSend.call(this, body);
    };
    
    res.json = function(object: any) {
      const jsonString = JSON.stringify(object);
      responseSize = Buffer.byteLength(jsonString, 'utf8');
      return originalJson.call(this, object);
    };

    // Extract request information
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
               req.socket.remoteAddress || 
               'unknown';
    
    const userAgent = req.headers['user-agent'] || '';
    const requestSize = parseInt(req.headers['content-length'] as string) || 0;
    
    // Extract user ID from authorization token (simplified)
    let userId: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // In a real app, decode JWT to get user ID
      userId = authHeader.substring(0, 10);
    }

    // Wait for response to complete
    res.on('finish', async () => {
      const responseTime = Date.now() - startTime;
      
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        method: req.method || '',
        url: req.url || '',
        userAgent,
        ip,
        userId,
        statusCode: res.statusCode,
        responseTime,
        requestSize,
        responseSize,
        level: res.statusCode >= 400 ? 'error' : 'info',
        metadata: {
          query: req.query,
          body: req.method !== 'GET' ? req.body : undefined,
        },
      };

      await logger.log(logEntry);
    });

    next();
  };
}

// Security event logger
export class SecurityLogger extends Logger {
  async logSecurityEvent(event: {
    type: 'login_attempt' | 'login_success' | 'login_failure' | 'password_reset' | 'account_locked' | 'suspicious_activity';
    userId?: string;
    ip: string;
    userAgent?: string;
    details?: Record<string, any>;
  }) {
    await this.log({
      timestamp: new Date().toISOString(),
      method: 'SECURITY',
      url: event.type,
      userAgent: event.userAgent,
      ip: event.ip,
      userId: event.userId,
      level: event.type.includes('failure') || event.type.includes('suspicious') ? 'warn' : 'info',
      metadata: {
        securityEvent: true,
        eventType: event.type,
        ...event.details,
      },
    });
  }
}

// Export singleton instances
export const logger = new Logger();
export const securityLogger = new SecurityLogger();

export default Logger;