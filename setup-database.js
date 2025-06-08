// Database setup script for NutriWise
const { getDatabaseAdapter } = require('./lib/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    const db = await getDatabaseAdapter();
    const migrationsDir = path.join(__dirname, 'migrations');
    
    // Get all migration files
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('Running database migrations...');
    
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      // Split SQL by semicolons and execute each statement
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await db.exec(statement.trim());
        }
      }
      
      console.log(`✓ Completed migration: ${file}`);
    }
    
    console.log('All migrations completed successfully!');
    
    // Test database connection
    const testUser = await db.get('SELECT * FROM users WHERE id = 1');
    const testPayments = await db.query('SELECT COUNT(*) as count FROM payments');
    
    console.log('\nDatabase test results:');
    console.log(`Test user: ${testUser ? testUser.fullName : 'Not found'}`);
    console.log(`Total payments: ${testPayments[0]?.count || 0}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };