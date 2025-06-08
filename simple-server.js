// Simple NutriConnect Server - Working Implementation
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
let db;

const initDatabase = async () => {
    try {
        db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });

        // Simple user table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                fullName TEXT NOT NULL,
                role TEXT DEFAULT 'CLIENT',
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Check if admin exists, if not create
        const adminExists = await db.get('SELECT id FROM users WHERE username = ?', ['admin']);
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.run(`
                INSERT INTO users (username, password, email, fullName, role) 
                VALUES (?, ?, ?, ?, ?)
            `, ['admin', hashedPassword, 'admin@nutriconnect.com', 'Administrator', 'ADMIN']);
            console.log('✅ Admin user created');
        }

        console.log('✅ Database initialized');
    } catch (error) {
        console.error('❌ Database error:', error);
    }
};

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, email, fullName } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await db.run(`
            INSERT INTO users (username, password, email, fullName) 
            VALUES (?, ?, ?, ?)
        `, [username, hashedPassword, email, fullName]);

        const token = jwt.sign(
            { userId: result.lastID, username, role: 'CLIENT' },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: result.lastID,
                username,
                email,
                fullName,
                role: 'CLIENT'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT id, username, email, fullName, role FROM users WHERE id = ?', [req.user.userId]);
        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Start server
const startServer = async () => {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log(`
🚀 NutriConnect Server Running!

📊 Server Details:
   • Port: ${PORT}
   • API Base: http://localhost:${PORT}/api
   • Health: http://localhost:${PORT}/api/health

🔐 Test Login:
   • Username: admin
   • Password: admin123

🌐 Frontend: 
   • Serve complete-dietitian-platform.html on port 8080
   • python3 -m http.server 8080

✅ Ready for testing!
        `);
    });
};

startServer().catch(console.error);