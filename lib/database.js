// Database configuration for production deployment
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const isDevelopment = process.env.NODE_ENV === 'development';
const DATABASE_URL = process.env.DATABASE_URL;

// PostgreSQL connection for production
let pgPool;
if (!isDevelopment && DATABASE_URL) {
  pgPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

// SQLite connection for development
let sqliteDb;

async function getDatabase() {
  if (isDevelopment || !DATABASE_URL) {
    // Use SQLite for development
    if (!sqliteDb) {
      sqliteDb = await open({
        filename: process.env.DATABASE_URL || './database.sqlite',
        driver: sqlite3.Database
      });
    }
    return sqliteDb;
  } else {
    // Use PostgreSQL for production
    return pgPool;
  }
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
  const type = isDevelopment || !DATABASE_URL ? 'sqlite' : 'postgres';
  return new DatabaseAdapter(db, type);
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
  pgPool,
  sqliteDb
};