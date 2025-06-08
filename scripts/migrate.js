#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { getDatabaseAdapter } = require('../lib/database');
const bcrypt = require('bcryptjs');

async function runMigrations() {
    console.log('🚀 Starting database migrations...');
    
    try {
        const db = await getDatabaseAdapter();
        
        // Create migrations table if it doesn't exist
        const createMigrationsTable = db.type === 'postgres' 
            ? `CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
            : `CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL UNIQUE,
                executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;
        
        await db.exec(createMigrationsTable);
        console.log('✅ Migrations table ready');
        
        // Get list of migration files
        const migrationsDir = path.join(__dirname, '../migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
        
        console.log(`📂 Found ${migrationFiles.length} migration files`);
        
        for (const filename of migrationFiles) {
            // Check if migration already executed
            const existingMigration = await db.get(
                'SELECT id FROM migrations WHERE filename = ?',
                [filename]
            );
            
            if (existingMigration) {
                console.log(`⏭️  Skipping ${filename} (already executed)`);
                continue;
            }
            
            console.log(`🔄 Executing ${filename}...`);
            
            // Read and execute migration
            const migrationPath = path.join(migrationsDir, filename);
            let migrationSQL = fs.readFileSync(migrationPath, 'utf8');
            
            // Handle special case for admin user creation with password hashing
            if (filename.includes('admin_user')) {
                const hashedPassword1 = await bcrypt.hash('dietitian123', 10);
                const hashedPassword2 = await bcrypt.hash('client123', 10);
                
                migrationSQL = migrationSQL
                    .replace('$2a$10$8K4QKvvOTJ5RYpQQQQQQu7VxZxZxZxZxZxZxZxZxZxZxZxZxZxZx.', hashedPassword1)
                    .replace('$2a$10$8K4QKvvOTJ5RYpQQQQQQu7VxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZ.', hashedPassword2);
            }
            
            // Split by semicolon and execute each statement
            const statements = migrationSQL
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));
            
            for (const statement of statements) {
                if (statement.trim()) {
                    await db.exec(statement);
                }
            }
            
            // Record migration as executed
            await db.run(
                'INSERT INTO migrations (filename) VALUES (?)',
                [filename]
            );
            
            console.log(`✅ Executed ${filename}`);
        }
        
        console.log('🎉 All migrations completed successfully!');
        
        // Close database connection
        await db.close();
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migrations if this script is executed directly
if (require.main === module) {
    runMigrations();
}

module.exports = { runMigrations };