// auth-server.js - Simplified Authentication Server
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const HOST = '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'nutriconnect-secret-key-2024';

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup
let db;

function initDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./auth-database.sqlite', (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
                return;
            }
            console.log('✅ Connected to SQLite database');
            
            // Create users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    fullName TEXT NOT NULL,
                    phone TEXT,
                    role TEXT DEFAULT 'CLIENT',
                    age INTEGER,
                    gender TEXT,
                    weight REAL,
                    height REAL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ Users table ready');
                seedDatabase().then(resolve).catch(reject);
            });
        });
    });
}

async function seedDatabase() {
    return new Promise((resolve, reject) => {
        // Check if users already exist
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            if (row.count > 0) {
                console.log('✅ Database already seeded');
                resolve();
                return;
            }
            
            console.log('🌱 Seeding database with test accounts...');
            
            // Create test accounts
            const testUsers = [
                {
                    username: 'dr.priya',
                    email: 'dr.priya@nutriconnect.com',
                    password: 'dietitian123',
                    fullName: 'Dr. Priya Sharma',
                    phone: '9876543210',
                    role: 'DIETITIAN',
                    age: 35,
                    gender: 'Female'
                },
                {
                    username: 'rahul.kumar',
                    email: 'rahul.kumar@example.com',
                    password: 'client123',
                    fullName: 'Rahul Kumar',
                    phone: '9876543211',
                    role: 'CLIENT',
                    age: 28,
                    gender: 'Male',
                    weight: 75,
                    height: 175
                },
                {
                    username: 'admin',
                    email: 'admin@nutriconnect.com',
                    password: 'admin123',
                    fullName: 'System Administrator',
                    phone: '9876543200',
                    role: 'ADMIN',
                    age: 30,
                    gender: 'Male'
                }
            ];
            
            let completed = 0;
            const total = testUsers.length;
            
            testUsers.forEach(user => {
                bcrypt.hash(user.password, 10, (err, hashedPassword) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    db.run(`
                        INSERT INTO users (username, email, password, fullName, phone, role, age, gender, weight, height)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        user.username,
                        user.email,
                        hashedPassword,
                        user.fullName,
                        user.phone,
                        user.role,
                        user.age,
                        user.gender,
                        user.weight || null,
                        user.height || null
                    ], (err) => {
                        if (err) {
                            console.error(`Error creating user ${user.username}:`, err);
                        } else {
                            console.log(`✅ Created user: ${user.username} (${user.role})`);
                        }
                        
                        completed++;
                        if (completed === total) {
                            console.log('✅ Database seeding completed');
                            resolve();
                        }
                    });
                });
            });
        });
    });
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        server: 'NutriConnect Authentication Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        port: PORT,
        endpoints: {
            health: '/api/health',
            register: '/api/auth/register',
            login: '/api/auth/login',
            profile: '/api/auth/me',
            users: '/api/users'
        }
    });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName, phone, role, age, gender, weight, height } = req.body;
        
        // Validation
        if (!username || !email || !password || !fullName) {
            return res.status(400).json({ 
                error: 'Missing required fields: username, email, password, fullName' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long' 
            });
        }
        
        // Check if user already exists
        db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (row) {
                return res.status(409).json({ error: 'Username or email already exists' });
            }
            
            // Hash password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Password hashing error:', err);
                    return res.status(500).json({ error: 'Password processing error' });
                }
                
                // Insert new user
                db.run(`
                    INSERT INTO users (username, email, password, fullName, phone, role, age, gender, weight, height)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    username,
                    email,
                    hashedPassword,
                    fullName,
                    phone || null,
                    role || 'CLIENT',
                    age || null,
                    gender || null,
                    weight || null,
                    height || null
                ], function(err) {
                    if (err) {
                        console.error('User creation error:', err);
                        return res.status(500).json({ error: 'Failed to create user' });
                    }
                    
                    // Generate JWT token
                    const token = jwt.sign(
                        { 
                            userId: this.lastID, 
                            username: username,
                            role: role || 'CLIENT' 
                        },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );
                    
                    res.status(201).json({
                        message: 'User registered successfully',
                        token: token,
                        user: {
                            id: this.lastID,
                            username: username,
                            email: email,
                            fullName: fullName,
                            role: role || 'CLIENT'
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login
app.post('/api/auth/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Find user by username or email
        db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            // Verify password
            bcrypt.compare(password, user.password, (err, isValid) => {
                if (err) {
                    console.error('Password comparison error:', err);
                    return res.status(500).json({ error: 'Authentication error' });
                }
                
                if (!isValid) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                
                // Generate JWT token
                const token = jwt.sign(
                    { 
                        userId: user.id, 
                        username: user.username,
                        role: user.role 
                    },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );
                
                res.json({
                    message: 'Login successful',
                    token: token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                        role: user.role,
                        phone: user.phone,
                        age: user.age,
                        gender: user.gender,
                        weight: user.weight,
                        height: user.height
                    }
                });
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            phone: user.phone,
            age: user.age,
            gender: user.gender,
            weight: user.weight,
            height: user.height,
            createdAt: user.createdAt
        });
    });
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    db.all('SELECT id, username, email, fullName, role, createdAt FROM users', (err, users) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ users });
    });
});

// Test endpoint for credentials
app.get('/api/test-credentials', (req, res) => {
    res.json({
        message: 'Test credentials for NutriConnect',
        credentials: [
            {
                role: 'DIETITIAN',
                username: 'dr.priya',
                password: 'dietitian123',
                email: 'dr.priya@nutriconnect.com'
            },
            {
                role: 'CLIENT',
                username: 'rahul.kumar',
                password: 'client123',
                email: 'rahul.kumar@example.com'
            },
            {
                role: 'ADMIN',
                username: 'admin',
                password: 'admin123',
                email: 'admin@nutriconnect.com'
            }
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database and start server
initDatabase()
    .then(() => {
        app.listen(PORT, HOST, () => {
            console.log('🚀==============================================🚀');
            console.log('   🔐 NutriConnect Authentication Server');
            console.log('🚀==============================================🚀');
            console.log('');
            console.log(`📍 Server URL: http://${HOST}:${PORT}`);
            console.log(`🌐 Network Access: http://10.26.1.11:${PORT}`);
            console.log(`🏠 Local Access: http://localhost:${PORT}`);
            console.log('');
            console.log('✅ Available Endpoints:');
            console.log('   📊 GET  /api/health - Server health check');
            console.log('   👤 POST /api/auth/register - User registration');
            console.log('   🔑 POST /api/auth/login - User authentication');
            console.log('   👨‍💼 GET  /api/auth/me - Current user profile');
            console.log('   👥 GET  /api/users - All users (admin only)');
            console.log('   🧪 GET  /api/test-credentials - Test account info');
            console.log('');
            console.log('👥 Test Accounts:');
            console.log('   🩺 Dietitian: dr.priya / dietitian123');
            console.log('   👤 Client: rahul.kumar / client123');
            console.log('   👨‍💼 Admin: admin / admin123');
            console.log('');
            console.log('✅ Database: SQLite (auth-database.sqlite)');
            console.log('✅ Security: bcrypt + JWT');
            console.log('✅ CORS: Enabled for all origins');
            console.log('');
        });
    })
    .catch(err => {
        console.error('❌ Failed to initialize authentication server:', err);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down authentication server...');
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('✅ Database connection closed');
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});