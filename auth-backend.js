const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'nutriconnect-super-secret-key-2024';
const dbPath = path.join(__dirname, 'database.sqlite');

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'NutriConnect Auth Server is running',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName, role = 'CLIENT' } = req.body;
        
        if (!username || !email || !password || !fullName) {
            return res.status(400).json({
                error: 'Username, email, password, and full name are required'
            });
        }

        // Check if user already exists
        db.get(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email],
            async (err, existingUser) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({
                        error: 'Database error'
                    });
                }

                if (existingUser) {
                    return res.status(409).json({
                        error: 'Username or email already exists'
                    });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert new user
                db.run(
                    `INSERT INTO users (username, email, password, fullName, role, emailVerified, createdAt, updatedAt)
                     VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
                    [username, email, hashedPassword, fullName, role.toUpperCase()],
                    function(err) {
                        if (err) {
                            console.error('Insert error:', err);
                            return res.status(500).json({
                                error: 'Failed to create user'
                            });
                        }

                        // Generate JWT token
                        const token = jwt.sign(
                            {
                                userId: this.lastID,
                                username,
                                role: role.toUpperCase()
                            },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );

                        // Get the created user
                        db.get(
                            'SELECT * FROM users WHERE id = ?',
                            [this.lastID],
                            (err, user) => {
                                if (err) {
                                    return res.status(500).json({
                                        error: 'User created but failed to retrieve'
                                    });
                                }

                                res.status(201).json({
                                    success: true,
                                    message: 'User registered successfully',
                                    token,
                                    user
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Server error during registration'
        });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                error: 'Username and password are required'
            });
        }

        // Find user in database
        db.get(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username],
            async (err, user) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({
                        error: 'Database error'
                    });
                }

                if (!user) {
                    return res.status(401).json({
                        error: 'Invalid username or password'
                    });
                }

                // Verify password
                const isValidPassword = await bcrypt.compare(password, user.password);
                
                if (!isValidPassword) {
                    return res.status(401).json({
                        error: 'Invalid username or password'
                    });
                }

                // Generate JWT token
                const token = jwt.sign(
                    { 
                        userId: user.id, 
                        username: user.username,
                        role: user.role 
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // Return user data (without password)
                const { password: _, ...userWithoutPassword } = user;
                
                res.json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: userWithoutPassword
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                error: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get fresh user data
        db.get(
            'SELECT id, username, email, fullName, role, createdAt FROM users WHERE id = ?',
            [decoded.userId],
            (err, user) => {
                if (err || !user) {
                    return res.status(401).json({
                        error: 'Invalid token'
                    });
                }

                res.json({
                    valid: true,
                    user
                });
            }
        );
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token'
        });
    }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                error: 'No token provided'
            });
        }

        // Verify the token is valid
        jwt.verify(token, JWT_SECRET);
        
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token'
        });
    }
});

// Get user profile endpoint
app.get('/api/users/profile', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                error: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        db.get(
            'SELECT id, username, email, fullName, role, createdAt FROM users WHERE id = ?',
            [decoded.userId],
            (err, user) => {
                if (err || !user) {
                    return res.status(404).json({
                        error: 'User not found'
                    });
                }

                res.json({
                    success: true,
                    user
                });
            }
        );
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token'
        });
    }
});

// Test users endpoint (for development)
app.get('/api/test-users', (req, res) => {
    db.all(
        'SELECT username, fullName, role, email FROM users WHERE username IN (?, ?)',
        ['dr.priya', 'rahul.kumar'],
        (err, users) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ users });
        }
    );
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀====================================================🚀');
    console.log('   🔐 NUTRICONNECT AUTH SERVER STARTED! 🔐');
    console.log('🚀====================================================🚀');
    console.log('');
    console.log('📍 Server URL: http://0.0.0.0:3000');
    console.log('🌐 Network Access: http://10.26.1.11:3000');
    console.log('🏠 Local Access: http://localhost:3000');
    console.log('');
    console.log('✅ AUTHENTICATION ENDPOINTS:');
    console.log('   🔓 POST /api/auth/login - User login');
    console.log('   🔍 GET /api/auth/verify - Token verification');
    console.log('   👤 GET /api/users/profile - User profile');
    console.log('   🩺 GET /api/health - Health check');
    console.log('   👥 GET /api/test-users - Test user list');
    console.log('');
    console.log('👥 TEST ACCOUNTS:');
    console.log('   🩺 Dietitian: dr.priya / dietitian123');
    console.log('   👤 Client: rahul.kumar / client123');
    console.log('');
    console.log('🔥 AUTH SERVER READY FOR FRONTEND TESTING!');
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down auth server...');
    db.close();
    process.exit(0);
});