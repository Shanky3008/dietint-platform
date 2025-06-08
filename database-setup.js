const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

async function createDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
            } else {
                console.log('✅ Connected to SQLite database');
                resolve(db);
            }
        });
    });
}

async function createUsersTable(db) {
    return new Promise((resolve, reject) => {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                fullName TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('CLIENT', 'DIETITIAN', 'ADMIN')),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        db.run(createTableSQL, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
                reject(err);
            } else {
                console.log('✅ Users table created/verified');
                resolve();
            }
        });
    });
}

async function seedTestUsers(db) {
    const testUsers = [
        {
            username: 'dr.priya',
            email: 'dr.priya@nutriconnect.com',
            password: 'dietitian123',
            fullName: 'Dr. Priya Sharma',
            role: 'DIETITIAN'
        },
        {
            username: 'rahul.kumar',
            email: 'rahul.kumar@gmail.com',
            password: 'client123',
            fullName: 'Rahul Kumar',
            role: 'CLIENT'
        }
    ];

    for (const user of testUsers) {
        try {
            // Check if user already exists
            const existingUser = await new Promise((resolve, reject) => {
                db.get('SELECT username FROM users WHERE username = ?', [user.username], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (existingUser) {
                console.log(`👤 User ${user.username} already exists`);
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Insert user
            await new Promise((resolve, reject) => {
                const insertSQL = `
                    INSERT INTO users (username, email, password, fullName, role)
                    VALUES (?, ?, ?, ?, ?)
                `;
                
                db.run(insertSQL, [
                    user.username,
                    user.email,
                    hashedPassword,
                    user.fullName,
                    user.role
                ], function(err) {
                    if (err) {
                        console.error(`Error creating user ${user.username}:`, err);
                        reject(err);
                    } else {
                        console.log(`✅ Created user: ${user.username} (${user.role})`);
                        resolve();
                    }
                });
            });

        } catch (error) {
            console.error(`Error processing user ${user.username}:`, error);
        }
    }
}

async function verifyTestUsers(db) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT username, fullName, role, email, createdAt 
            FROM users 
            WHERE username IN ('dr.priya', 'rahul.kumar')
            ORDER BY role DESC
        `;
        
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error verifying users:', err);
                reject(err);
            } else {
                console.log('\n📋 TEST USERS VERIFICATION:');
                console.log('================================');
                rows.forEach(user => {
                    console.log(`👤 ${user.username}`);
                    console.log(`   Name: ${user.fullName}`);
                    console.log(`   Email: ${user.email}`);
                    console.log(`   Role: ${user.role}`);
                    console.log(`   Created: ${user.createdAt}`);
                    console.log('');
                });
                resolve(rows);
            }
        });
    });
}

async function setupDatabase() {
    let db;
    
    try {
        console.log('🚀 Starting database setup...\n');
        
        // Create/connect to database
        db = await createDatabase();
        
        // Create users table
        await createUsersTable(db);
        
        // Seed test users
        console.log('\n📝 Seeding test users...');
        await seedTestUsers(db);
        
        // Verify users
        console.log('\n🔍 Verifying test users...');
        await verifyTestUsers(db);
        
        console.log('✅ Database setup completed successfully!');
        console.log('\n🎯 TEST CREDENTIALS:');
        console.log('Dietitian: dr.priya / dietitian123');
        console.log('Client: rahul.kumar / client123');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    } finally {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('\n🔒 Database connection closed');
                }
            });
        }
    }
}

// Run setup if called directly
if (require.main === module) {
    setupDatabase();
}

module.exports = {
    setupDatabase,
    createDatabase,
    createUsersTable,
    seedTestUsers,
    verifyTestUsers
};