// content-management-server.js - Enhanced backend with content management
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'nutriconnect_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Database setup
let db;

async function initDatabase() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // Create users table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            fullName TEXT NOT NULL,
            role TEXT DEFAULT 'client',
            phone TEXT,
            dateOfBirth DATE,
            gender TEXT,
            height REAL,
            weight REAL,
            activityLevel TEXT,
            dietaryRestrictions TEXT,
            healthGoals TEXT,
            profilePicture TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Ensure content table exists (from setup script)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section TEXT NOT NULL,
            content_key TEXT NOT NULL,
            content_value TEXT NOT NULL,
            content_type TEXT DEFAULT 'text',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await db.exec(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_content_section_key 
        ON content(section, content_key)
    `);

    // Create default admin user if not exists
    const adminExists = await db.get('SELECT id FROM users WHERE username = ?', ['dr.priya']);
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('dietitian123', 10);
        await db.run(`
            INSERT INTO users (username, password, email, fullName, role)
            VALUES (?, ?, ?, ?, ?)
        `, ['dr.priya', hashedPassword, 'dr.priya@nutriconnect.com', 'Dr. Priya Sharma', 'dietitian']);
        console.log('✅ Default admin user created');
    }

    // Create default client user if not exists
    const clientExists = await db.get('SELECT id FROM users WHERE username = ?', ['rahul.kumar']);
    if (!clientExists) {
        const hashedPassword = await bcrypt.hash('client123', 10);
        await db.run(`
            INSERT INTO users (username, password, email, fullName, role)
            VALUES (?, ?, ?, ?, ?)
        `, ['rahul.kumar', hashedPassword, 'rahul.kumar@email.com', 'Rahul Kumar', 'client']);
        console.log('✅ Default client user created');
    }

    console.log('✅ Database initialized');
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
        message: 'NutriConnect Auth Server is running',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, email, fullName, role = 'client' } = req.body;

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
        const token = jwt.sign(
            { userId: result.lastID, username, role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: result.lastID, username, email, fullName, role }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

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
        
        const content = await db.all(query, params);
        
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
        await db.run(`
            INSERT INTO content (section, content_key, content_value, content_type, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(section, content_key) DO UPDATE SET
                content_value = excluded.content_value,
                content_type = excluded.content_type,
                updated_at = CURRENT_TIMESTAMP
        `, [section, key, value, type]);
        
        res.json({
            success: true,
            message: 'Content updated successfully'
        });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Bulk update content (Admin only)
app.put('/api/content/bulk', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { updates } = req.body;
        
        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({ error: 'Updates array is required' });
        }
        
        // Begin transaction
        await db.run('BEGIN TRANSACTION');
        
        try {
            for (const update of updates) {
                const { section, key, value, type = 'text' } = update;
                
                if (!section || !key || value === undefined) {
                    throw new Error('Section, key, and value are required for each update');
                }
                
                await db.run(`
                    INSERT INTO content (section, content_key, content_value, content_type, updated_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(section, content_key) DO UPDATE SET
                        content_value = excluded.content_value,
                        content_type = excluded.content_type,
                        updated_at = CURRENT_TIMESTAMP
                `, [section, key, value, type]);
            }
            
            await db.run('COMMIT');
            
            res.json({
                success: true,
                message: `${updates.length} content items updated successfully`
            });
        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Bulk update content error:', error);
        res.status(500).json({ error: 'Failed to update content: ' + error.message });
    }
});

// Delete content (Admin only)
app.delete('/api/content/:section/:key', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { section, key } = req.params;
        
        const result = await db.run(
            'DELETE FROM content WHERE section = ? AND content_key = ?',
            [section, key]
        );
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }
        
        res.json({
            success: true,
            message: 'Content deleted successfully'
        });
    } catch (error) {
        console.error('Delete content error:', error);
        res.status(500).json({ error: 'Failed to delete content' });
    }
});

// Get content structure (for admin interface)
app.get('/api/content/structure', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const sections = await db.all(`
            SELECT section, 
                   COUNT(*) as item_count,
                   GROUP_CONCAT(content_key) as keys
            FROM content 
            GROUP BY section 
            ORDER BY section
        `);
        
        const structure = sections.map(section => ({
            section: section.section,
            itemCount: section.item_count,
            keys: section.keys.split(',')
        }));
        
        res.json({
            success: true,
            structure
        });
    } catch (error) {
        console.error('Get content structure error:', error);
        res.status(500).json({ error: 'Failed to fetch content structure' });
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
            console.log(`🚀 Content Management Server running on http://${HOST}:${PORT}`);
            console.log(`📄 Content API available at http://${HOST}:${PORT}/api/content`);
            console.log(`🔐 Admin endpoints require authentication with dietitian role`);
            console.log(`💾 Database: SQLite (./database.sqlite)`);
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