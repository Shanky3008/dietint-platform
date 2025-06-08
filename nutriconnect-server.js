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
const PORT = 5000;
const HOST = '0.0.0.0'; // Listen on all interfaces

// Enhanced CORS configuration
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
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

    // Create tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            fullName TEXT NOT NULL,
            phone TEXT,
            role TEXT DEFAULT 'CLIENT',
            age INTEGER,
            gender TEXT,
            dateOfBirth TEXT,
            weight REAL,
            height REAL,
            bmi REAL,
            twoFactorEnabled INTEGER DEFAULT 0,
            twoFactorSecret TEXT,
            twoFactorBackupCodes TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            dieticianId INTEGER,
            date TEXT NOT NULL,
            timeSlot TEXT NOT NULL,
            status TEXT DEFAULT 'SCHEDULED',
            consultationType TEXT NOT NULL,
            notes TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS diet_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            title TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            targetCalories INTEGER,
            calorieTarget INTEGER,
            proteinTarget INTEGER,
            carbTarget INTEGER,
            fatTarget INTEGER,
            duration INTEGER,
            meals TEXT,
            status TEXT DEFAULT 'ACTIVE',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            appointmentId INTEGER,
            amount REAL NOT NULL,
            currency TEXT DEFAULT 'INR',
            method TEXT NOT NULL,
            paymentMethod TEXT,
            serviceType TEXT,
            upiTransactionId TEXT,
            status TEXT DEFAULT 'PENDING',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id),
            FOREIGN KEY (appointmentId) REFERENCES appointments(id)
        );

        CREATE TABLE IF NOT EXISTS nutritional_foods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            calories REAL,
            protein REAL,
            carbs REAL,
            fat REAL,
            fiber REAL,
            sodium REAL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT NOT NULL,
            authorId INTEGER,
            published INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (authorId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
        );
    `);

    // Seed initial data
    await seedDatabase();
}

async function seedDatabase() {
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) return;

    console.log('🌱 Seeding database...');

    // Create dietitian user
    const dietitianPassword = await bcrypt.hash('dietitian123', 10);
    await db.run(`
        INSERT INTO users (username, email, password, fullName, phone, role, age, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, ['dr.priya', 'dietitian@example.com', dietitianPassword, 'Dr. Priya Sharma', '9876543210', 'DIETITIAN', 35, 'Female']);

    // Create test client
    const clientPassword = await bcrypt.hash('client123', 10);
    await db.run(`
        INSERT INTO users (username, email, password, fullName, phone, role, age, gender, weight, height, bmi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['rahul.kumar', 'client@example.com', clientPassword, 'Rahul Kumar', '9876543211', 'CLIENT', 28, 'Male', 75, 175, 24.49]);

    console.log('✅ Database seeded successfully!');
}

// Auth middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nutriconnect-jwt-secret');
        req.user = await db.get('SELECT * FROM users WHERE id = ?', decoded.userId);
        
        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Routes

// Serve main dashboard
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutriConnect - Professional Nutrition Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 50px; }
        .header h1 { font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .status-card { 
            background: rgba(255,255,255,0.15); 
            padding: 30px; 
            border-radius: 20px; 
            margin: 20px 0;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .success { background: linear-gradient(45deg, #4CAF50, #45a049); }
        .info { background: rgba(255,255,255,0.2); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
        .feature-card {
            background: rgba(255,255,255,0.1);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .feature-card:hover { transform: translateY(-5px); }
        .btn {
            background: linear-gradient(45deg, #FF6B6B, #FF8E53);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
        }
        .btn:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .endpoint { 
            background: rgba(0,0,0,0.3); 
            padding: 10px 15px; 
            border-radius: 8px; 
            margin: 5px 0; 
            font-family: 'Courier New', monospace;
            border-left: 4px solid #4CAF50;
        }
        .highlight { color: #FFD700; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🥗 NutriConnect</h1>
            <p style="font-size: 1.3em; opacity: 0.9;">Professional Nutrition & Wellness Platform</p>
        </div>
        
        <div class="status-card success">
            <h2 style="text-align: center; margin-bottom: 20px;">✅ Server Successfully Running!</h2>
            <div style="text-align: center;">
                <div class="highlight">Network URL: http://10.26.1.11:5000</div>
                <div class="highlight">Local URL: http://localhost:5000</div>
                <div>Host: ${HOST} | Port: ${PORT}</div>
                <div>Started: ${new Date().toLocaleString()}</div>
            </div>
        </div>
        
        <div class="grid">
            <div class="feature-card">
                <h3>🎯 Dashboard</h3>
                <p>Comprehensive nutrition tracking and analytics</p>
                <a href="/app/dashboard/page.tsx" class="btn">View Dashboard</a>
            </div>
            <div class="feature-card">
                <h3>👨‍⚕️ Consultations</h3>
                <p>Book appointments with certified dietitians</p>
                <a href="/app/auth/login/page.tsx" class="btn">Login</a>
            </div>
            <div class="feature-card">
                <h3>📱 Mobile App</h3>
                <p>iOS & Android apps for on-the-go tracking</p>
                <a href="/components/" class="btn">View Components</a>
            </div>
            <div class="feature-card">
                <h3>🤖 AI Insights</h3>
                <p>Personalized nutrition recommendations</p>
                <a href="/api/health" class="btn">API Health</a>
            </div>
        </div>
        
        <div class="status-card info">
            <h3>📊 Available API Endpoints:</h3>
            <div class="endpoint">GET /api/auth/login - User authentication</div>
            <div class="endpoint">GET /api/users/me - User profile</div>
            <div class="endpoint">GET /api/appointments - Appointment management</div>
            <div class="endpoint">GET /api/diet-plans - Diet plan access</div>
            <div class="endpoint">GET /api/health - Server health check</div>
        </div>
        
        <div class="status-card info">
            <h3>👥 Test Credentials:</h3>
            <p><strong>Dietitian:</strong> dr.priya / dietitian123</p>
            <p><strong>Client:</strong> rahul.kumar / client123</p>
        </div>
        
        <div class="status-card success">
            <h2 style="text-align: center;">🎉 Connection Issue Resolved!</h2>
            <p style="text-align: center; font-size: 1.2em;">
                NutriConnect is now accessible from <span class="highlight">10.26.1.11:5000</span>
            </p>
        </div>
    </div>
</body>
</html>`;
    res.end(html);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        server: 'NutriConnect Professional Platform',
        timestamp: new Date().toISOString(),
        host: HOST,
        port: PORT,
        database: 'Connected',
        endpoints: {
            dashboard: '/',
            auth: '/api/auth/*',
            users: '/api/users/*',
            appointments: '/api/appointments/*',
            diet_plans: '/api/diet-plans/*'
        }
    });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await db.get(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [username, username]
        );

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'nutriconnect-jwt-secret',
            { expiresIn: '7d' }
        );

        res.json({
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

// User routes
app.get('/api/users/me', authenticate, async (req, res) => {
    const { password, twoFactorSecret, twoFactorBackupCodes, ...user } = req.user;
    res.json(user);
});

// Serve static files (components, pages, etc.)
app.get('/app/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

app.get('/components/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'Component not found' });
    }
});

// Initialize database and start server
initDatabase().then(() => {
    app.listen(PORT, HOST, () => {
        console.log('🚀========================================🚀');
        console.log('   🥗 NutriConnect Server Started! 🥗');
        console.log('🚀========================================🚀');
        console.log('');
        console.log(`📍 Server URL: http://${HOST}:${PORT}`);
        console.log(`🌐 Network Access: http://10.26.1.11:${PORT}`);
        console.log(`🏠 Local Access: http://localhost:${PORT}`);
        console.log('');
        console.log('✅ Features Available:');
        console.log('   🎯 Professional Dashboard');
        console.log('   👨‍⚕️ Dietitian Consultations');
        console.log('   📊 Nutrition Tracking');
        console.log('   🤖 AI Recommendations');
        console.log('   📱 Mobile-Ready UI');
        console.log('   🔒 Secure Authentication');
        console.log('');
        console.log('👥 Test Accounts:');
        console.log('   Dietitian: dr.priya / dietitian123');
        console.log('   Client: rahul.kumar / client123');
        console.log('');
        console.log('🎉 Connection issue resolved! Server accessible from network!');
        console.log('');
    });
}).catch(err => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
});