// Production-ready server with PostgreSQL support
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDatabaseAdapter } = require('./lib/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'nutriconnect_secret_key_2024';

// Security middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3002'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and documents are allowed'));
        }
    }
});

// Database connection
let db;

async function initDatabase() {
    try {
        db = await getDatabaseAdapter();
        console.log(`✅ Database connected (${db.type})`);
        
        // Run migrations if needed
        if (process.env.NODE_ENV === 'production') {
            const { runMigrations } = require('./scripts/migrate');
            await runMigrations();
        }
        
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Admin role middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'dietitian') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'NutriConnect Server is running',
        timestamp: new Date().toISOString(),
        database: db ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV
    });
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, email, fullName, role = 'client' } = req.body;

        // Validation
        if (!username || !password || !email || !fullName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await db.get(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await db.run(`
            INSERT INTO users (username, password, email, fullName, role)
            VALUES (?, ?, ?, ?, ?)
        `, [username, hashedPassword, email, fullName, role]);

        // Generate token
        const userId = result.lastID || result.insertId;
        const token = jwt.sign(
            { userId, username, role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: userId, username, email, fullName, role }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await db.get(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
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
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
    try {
        const user = await db.get(
            'SELECT id, username, email, fullName, role FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// CONTENT MANAGEMENT API ENDPOINTS

// Get all content or content by section
app.get('/api/content', async (req, res) => {
    try {
        const { section } = req.query;
        
        let query = 'SELECT * FROM content';
        let params = [];
        
        if (section) {
            query += ' WHERE section = ?';
            params.push(section);
        }
        
        query += ' ORDER BY section, content_key';
        
        const content = await db.query(query, params);
        
        // Group content by section for easier frontend consumption
        const groupedContent = {};
        content.forEach(item => {
            if (!groupedContent[item.section]) {
                groupedContent[item.section] = {};
            }
            groupedContent[item.section][item.content_key] = {
                value: item.content_value,
                type: item.content_type,
                updated_at: item.updated_at
            };
        });
        
        res.json({
            success: true,
            content: section ? groupedContent[section] || {} : groupedContent
        });
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// Get specific content item
app.get('/api/content/:section/:key', async (req, res) => {
    try {
        const { section, key } = req.params;
        
        const content = await db.get(
            'SELECT * FROM content WHERE section = ? AND content_key = ?',
            [section, key]
        );
        
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        
        res.json({
            success: true,
            content: {
                section: content.section,
                key: content.content_key,
                value: content.content_value,
                type: content.content_type,
                updated_at: content.updated_at
            }
        });
    } catch (error) {
        console.error('Get content item error:', error);
        res.status(500).json({ error: 'Failed to fetch content item' });
    }
});

// Update content (Admin only)
app.put('/api/content/:section/:key', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { section, key } = req.params;
        const { value, type = 'text' } = req.body;
        
        if (!value) {
            return res.status(400).json({ error: 'Content value is required' });
        }
        
        // Update or insert content
        if (db.type === 'postgres') {
            await db.run(`
                INSERT INTO content (section, content_key, content_value, content_type, updated_at)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                ON CONFLICT (section, content_key) DO UPDATE SET
                    content_value = EXCLUDED.content_value,
                    content_type = EXCLUDED.content_type,
                    updated_at = CURRENT_TIMESTAMP
            `, [section, key, value, type]);
        } else {
            await db.run(`
                INSERT INTO content (section, content_key, content_value, content_type, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(section, content_key) DO UPDATE SET
                    content_value = excluded.content_value,
                    content_type = excluded.content_type,
                    updated_at = CURRENT_TIMESTAMP
            `, [section, key, value, type]);
        }
        
        res.json({
            success: true,
            message: 'Content updated successfully'
        });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// File upload endpoint
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.json({
            success: true,
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database and start server
async function startServer() {
    try {
        await initDatabase();
        
        app.listen(PORT, HOST, () => {
            console.log(`🚀 NutriConnect Server running on http://${HOST}:${PORT}`);
            console.log(`📄 Content API available at http://${HOST}:${PORT}/api/content`);
            console.log(`🔐 Admin endpoints require authentication with dietitian role`);
            console.log(`💾 Database: ${db.type.toUpperCase()}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️  Shutting down server...');
    if (db) {
        await db.close();
        console.log('✅ Database connection closed');
    }
    process.exit(0);
});

startServer();