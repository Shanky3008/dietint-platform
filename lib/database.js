// Database configuration for Vercel deployment
const { Pool } = require('pg');

// Always use PostgreSQL for production and development
const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

// PostgreSQL connection pool
let pgPool;
if (DATABASE_URL) {
  pgPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
} else {
  console.warn('No DATABASE_URL provided. Please set POSTGRES_URL environment variable.');
}

async function getDatabase() {
  if (!pgPool) {
    throw new Error('Database connection not initialized. Please check DATABASE_URL environment variable.');
  }
  return pgPool;
}

// Database abstraction layer
class DatabaseAdapter {
  constructor(db, type) {
    this.db = db;
    this.type = type; // 'sqlite' or 'postgres'
  }

  async query(sql, params = []) {
    if (this.type === 'sqlite') {
      if (sql.startsWith('SELECT')) {
        return await this.db.all(sql, params);
      } else {
        return await this.db.run(sql, params);
      }
    } else {
      // PostgreSQL
      const result = await this.db.query(sql, params);
      return result.rows || result;
    }
  }

  async get(sql, params = []) {
    if (this.type === 'sqlite') {
      return await this.db.get(sql, params);
    } else {
      const result = await this.db.query(sql, params);
      return result.rows[0];
    }
  }

  async run(sql, params = []) {
    if (this.type === 'sqlite') {
      return await this.db.run(sql, params);
    } else {
      return await this.db.query(sql, params);
    }
  }

  async exec(sql) {
    if (this.type === 'sqlite') {
      return await this.db.exec(sql);
    } else {
      return await this.db.query(sql);
    }
  }

  async close() {
    if (this.type === 'sqlite' && this.db) {
      await this.db.close();
    } else if (this.type === 'postgres' && this.db) {
      await this.db.end();
    }
  }
}

async function getDatabaseAdapter() {
  const db = await getDatabase();
  return new DatabaseAdapter(db, 'postgres');
}

// Convert SQLite syntax to PostgreSQL
function convertSQLToPostgreSQL(sql) {
  return sql
    .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
    .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    .replace(/TEXT/g, 'VARCHAR(255)')
    .replace(/REAL/g, 'DECIMAL(10,2)')
    .replace(/CREATE TABLE IF NOT EXISTS/g, 'CREATE TABLE IF NOT EXISTS')
    .replace(/ON CONFLICT\(([^)]+)\) DO UPDATE SET/g, 'ON CONFLICT ($1) DO UPDATE SET');
}

module.exports = {
  getDatabase,
  getDatabaseAdapter,
  convertSQLToPostgreSQL,
  pgPool
};