// server.js - Complete backend server with all features
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
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces

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

        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paymentId INTEGER,
            invoiceNumber TEXT UNIQUE NOT NULL,
            amount REAL NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (paymentId) REFERENCES payments(id)
        );

        CREATE TABLE IF NOT EXISTS progress_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            metricType TEXT NOT NULL,
            value REAL NOT NULL,
            unit TEXT,
            notes TEXT,
            recordedAt TEXT NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
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
    // Check if data already exists
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) return;

    console.log('Seeding database...');

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

    // Add sample foods
    const foods = [
        ['Wheat Roti', 'Grains', 71, 2.6, 15.7, 0.4, 2.2],
        ['Brown Rice (1 cup)', 'Grains', 216, 5, 45, 1.8, 3.5],
        ['Moong Dal (1 cup)', 'Proteins', 212, 14.2, 38.7, 0.8, 15.4],
        ['Chicken Breast (100g)', 'Proteins', 165, 31, 0, 3.6, 0],
        ['Paneer (100g)', 'Proteins', 265, 18.3, 1.2, 20.8, 0],
        ['Spinach (1 cup)', 'Vegetables', 41, 5.3, 6.8, 0.5, 4.3],
        ['Banana (1 medium)', 'Fruits', 105, 1.3, 27, 0.4, 3.1],
        ['Milk (1 cup)', 'Dairy', 149, 7.7, 11.7, 7.9, 0],
        ['Almonds (10 pieces)', 'Nuts', 69, 2.5, 2.5, 6, 1.5]
    ];

    for (const food of foods) {
        await db.run(`
            INSERT INTO nutritional_foods (name, category, calories, protein, carbs, fat, fiber)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, food);
    }

    console.log('Database seeded successfully!');
}

// Auth middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
        req.user = await db.get('SELECT * FROM users WHERE id = ?', decoded.userId);
        
        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Role check middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

// Routes

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'Dietitian Platform API Running', 
        timestamp: new Date(),
        endpoints: {
            auth: '/api/auth/register, /api/auth/login',
            users: '/api/users/me, /api/users/profile',
            appointments: '/api/appointments',
            dietPlans: '/api/diet-plans',
            payments: '/api/payments'
        }
    });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName, phone, role = 'CLIENT' } = req.body;

        // Check existing user
        const existing = await db.get(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await db.run(`
            INSERT INTO users (username, email, password, fullName, phone, role)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [username, email, hashedPassword, fullName, phone, role]);

        const user = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);

        // Generate token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'default-secret-key',
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
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

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
            process.env.JWT_SECRET || 'default-secret-key',
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

app.put('/api/users/profile', authenticate, async (req, res) => {
    try {
        const { fullName, phone, age, gender, weight, height, dateOfBirth } = req.body;

        // Calculate BMI if weight and height are provided
        let bmi = null;
        if (weight && height) {
            bmi = weight / ((height / 100) ** 2);
        }

        await db.run(`
            UPDATE users
            SET fullName = ?, phone = ?, age = ?, gender = ?, weight = ?, height = ?, bmi = ?, dateOfBirth = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [fullName, phone, age, gender, weight, height, bmi, dateOfBirth, req.user.id]);

        const updatedUser = await db.get('SELECT * FROM users WHERE id = ?', req.user.id);
        const { password, twoFactorSecret, twoFactorBackupCodes, ...user } = updatedUser;
        res.json(user);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

app.get('/api/users/clients', authenticate, requireRole(['DIETITIAN', 'ADMIN']), async (req, res) => {
    try {
        const clients = await db.all(`
            SELECT u.*, 
                   COUNT(DISTINCT a.id) as appointmentCount,
                   COUNT(DISTINCT d.id) as dietPlanCount
            FROM users u
            LEFT JOIN appointments a ON u.id = a.userId
            LEFT JOIN diet_plans d ON u.id = d.userId
            WHERE u.role = 'CLIENT'
            GROUP BY u.id
        `);

        const sanitizedClients = clients.map(client => {
            const { password, twoFactorSecret, twoFactorBackupCodes, ...safeClient } = client;
            return {
                ...safeClient,
                _count: {
                    appointments: client.appointmentCount,
                    dietPlans: client.dietPlanCount
                }
            };
        });

        res.json(sanitizedClients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});

// Appointment routes
app.post('/api/appointments', authenticate, async (req, res) => {
    try {
        const { date, timeSlot, consultationType, notes, dieticianId } = req.body;

        const result = await db.run(`
            INSERT INTO appointments (userId, dieticianId, date, timeSlot, consultationType, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [req.user.id, dieticianId || 1, date, timeSlot, consultationType, notes]);

        const appointment = await db.get('SELECT * FROM appointments WHERE id = ?', result.lastID);
        res.json(appointment);
    } catch (error) {
        console.error('Appointment creation error:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

app.get('/api/appointments', authenticate, async (req, res) => {
    try {
        let query;
        let params;

        if (req.user.role === 'CLIENT') {
            query = `
                SELECT a.*, u.fullName, u.email, u.phone
                FROM appointments a
                JOIN users u ON a.dieticianId = u.id
                WHERE a.userId = ?
                ORDER BY a.date DESC
            `;
            params = [req.user.id];
        } else if (req.user.role === 'DIETITIAN') {
            query = `
                SELECT a.*, u.fullName, u.email, u.phone
                FROM appointments a
                JOIN users u ON a.userId = u.id
                WHERE a.dieticianId = ?
                ORDER BY a.date DESC
            `;
            params = [req.user.id];
        } else {
            query = `
                SELECT a.*, u.fullName, u.email, u.phone
                FROM appointments a
                JOIN users u ON a.userId = u.id
                ORDER BY a.date DESC
            `;
            params = [];
        }

        const appointments = await db.all(query, params);
        
        // Format appointments with user info
        const formattedAppointments = appointments.map(apt => ({
            ...apt,
            user: {
                fullName: apt.fullName,
                email: apt.email,
                phone: apt.phone
            }
        }));

        res.json(formattedAppointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

app.put('/api/appointments/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        await db.run(
            'UPDATE appointments SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [status, req.params.id]
        );
        const appointment = await db.get('SELECT * FROM appointments WHERE id = ?', req.params.id);
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

// Diet plan routes
app.post('/api/diet-plans', authenticate, requireRole(['DIETITIAN', 'ADMIN']), async (req, res) => {
    try {
        const { userId, title, name, description, targetCalories, proteinTarget, carbTarget, fatTarget, duration, meals } = req.body;

        const result = await db.run(`
            INSERT INTO diet_plans (userId, title, name, description, targetCalories, calorieTarget, proteinTarget, carbTarget, fatTarget, duration, meals)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId || req.user.id,
            title,
            name || title,
            description,
            targetCalories,
            targetCalories,
            proteinTarget,
            carbTarget,
            fatTarget,
            duration,
            meals ? JSON.stringify(meals) : null
        ]);

        const dietPlan = await db.get('SELECT * FROM diet_plans WHERE id = ?', result.lastID);
        res.json(dietPlan);
    } catch (error) {
        console.error('Diet plan creation error:', error);
        res.status(500).json({ error: 'Failed to create diet plan' });
    }
});

app.get('/api/diet-plans', authenticate, async (req, res) => {
    try {
        let query;
        let params;

        if (req.user.role === 'CLIENT') {
            query = `
                SELECT d.*, u.fullName, u.email
                FROM diet_plans d
                JOIN users u ON d.userId = u.id
                WHERE d.userId = ?
                ORDER BY d.createdAt DESC
            `;
            params = [req.user.id];
        } else {
            query = `
                SELECT d.*, u.fullName, u.email
                FROM diet_plans d
                JOIN users u ON d.userId = u.id
                ORDER BY d.createdAt DESC
            `;
            params = [];
        }

        const dietPlans = await db.all(query, params);
        
        // Format diet plans with user info and parse meals
        const formattedDietPlans = dietPlans.map(plan => ({
            ...plan,
            user: {
                fullName: plan.fullName,
                email: plan.email
            },
            meals: plan.meals ? JSON.parse(plan.meals) : null
        }));

        res.json(formattedDietPlans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch diet plans' });
    }
});

app.get('/api/diet-plans/:id', authenticate, async (req, res) => {
    try {
        const dietPlan = await db.get(`
            SELECT d.*, u.fullName, u.email
            FROM diet_plans d
            JOIN users u ON d.userId = u.id
            WHERE d.id = ?
        `, req.params.id);

        if (!dietPlan) {
            return res.status(404).json({ error: 'Diet plan not found' });
        }

        const formattedDietPlan = {
            ...dietPlan,
            user: {
                fullName: dietPlan.fullName,
                email: dietPlan.email
            },
            meals: dietPlan.meals ? JSON.parse(dietPlan.meals) : null
        };

        res.json(formattedDietPlan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch diet plan' });
    }
});

// Payment routes
app.post('/api/payments/generate-qr', authenticate, async (req, res) => {
    try {
        const { amount, appointmentId, serviceType } = req.body;
        
        const result = await db.run(`
            INSERT INTO payments (userId, appointmentId, amount, method, paymentMethod, serviceType)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [req.user.id, appointmentId, amount, 'UPI', 'UPI_QR', serviceType]);

        const payment = await db.get('SELECT * FROM payments WHERE id = ?', result.lastID);
        
        // Generate UPI string
        const upiId = process.env.UPI_ID || 'dietitian@upi';
        const payeeName = process.env.PAYEE_NAME || 'Dietitian Services';
        const upiString = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=Payment for ${serviceType || 'Consultation'}`;

        res.json({
            paymentId: payment.id,
            qrCode: upiString, // Frontend will generate actual QR
            upiString,
            amount
        });
    } catch (error) {
        console.error('QR generation error:', error);
        res.status(500).json({ error: 'Failed to generate payment QR' });
    }
});

app.put('/api/payments/:id/confirm', authenticate, requireRole(['DIETITIAN', 'ADMIN']), async (req, res) => {
    try {
        const { upiTransactionId } = req.body;
        
        await db.run(
            'UPDATE payments SET status = ?, upiTransactionId = ? WHERE id = ?',
            ['COMPLETED', upiTransactionId, req.params.id]
        );

        // Generate invoice
        const payment = await db.get('SELECT * FROM payments WHERE id = ?', req.params.id);
        const invoiceNumber = `INV-${Date.now()}`;
        
        await db.run(`
            INSERT INTO invoices (paymentId, invoiceNumber, amount)
            VALUES (?, ?, ?)
        `, [payment.id, invoiceNumber, payment.amount]);

        const invoice = await db.get('SELECT * FROM invoices WHERE paymentId = ?', payment.id);

        res.json({ payment, invoice });
    } catch (error) {
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
});

app.get('/api/payments', authenticate, async (req, res) => {
    try {
        let query;
        let params;

        if (req.user.role === 'CLIENT') {
            query = `
                SELECT p.*, u.fullName, u.email, i.invoiceNumber, i.id as invoiceId
                FROM payments p
                JOIN users u ON p.userId = u.id
                LEFT JOIN invoices i ON p.id = i.paymentId
                WHERE p.userId = ?
                ORDER BY p.createdAt DESC
            `;
            params = [req.user.id];
        } else {
            query = `
                SELECT p.*, u.fullName, u.email, i.invoiceNumber, i.id as invoiceId
                FROM payments p
                JOIN users u ON p.userId = u.id
                LEFT JOIN invoices i ON p.id = i.paymentId
                ORDER BY p.createdAt DESC
            `;
            params = [];
        }

        const payments = await db.all(query, params);
        
        // Format payments with user info and invoices
        const formattedPayments = payments.map(payment => ({
            ...payment,
            user: {
                fullName: payment.fullName,
                email: payment.email
            },
            invoices: payment.invoiceNumber ? [{
                id: payment.invoiceId,
                invoiceNumber: payment.invoiceNumber
            }] : []
        }));

        res.json(formattedPayments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Progress tracking routes
app.post('/api/progress', authenticate, async (req, res) => {
    try {
        const { metricType, value, unit, notes } = req.body;
        
        const result = await db.run(`
            INSERT INTO progress_tracking (userId, metricType, value, unit, notes, recordedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [req.user.id, metricType, value, unit, notes, new Date().toISOString()]);

        // Update user's weight if metric is weight
        if (metricType === 'weight') {
            const height = req.user.height;
            const bmi = height ? value / ((height / 100) ** 2) : null;
            
            await db.run(
                'UPDATE users SET weight = ?, bmi = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
                [value, bmi, req.user.id]
            );
        }

        const progress = await db.get('SELECT * FROM progress_tracking WHERE id = ?', result.lastID);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to record progress' });
    }
});

app.get('/api/progress', authenticate, async (req, res) => {
    try {
        const { metricType } = req.query;
        let query = 'SELECT * FROM progress_tracking WHERE userId = ?';
        const params = [req.user.id];
        
        if (metricType) {
            query += ' AND metricType = ?';
            params.push(metricType);
        }
        
        query += ' ORDER BY recordedAt DESC LIMIT 50';
        
        const progress = await db.all(query, params);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// Food routes
app.get('/api/foods', authenticate, async (req, res) => {
    try {
        const foods = await db.all('SELECT * FROM nutritional_foods ORDER BY name ASC');
        res.json(foods);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch foods' });
    }
});

app.post('/api/foods', authenticate, requireRole(['DIETITIAN', 'ADMIN']), async (req, res) => {
    try {
        const { name, category, calories, protein, carbs, fat, fiber, sodium } = req.body;
        
        const result = await db.run(`
            INSERT INTO nutritional_foods (name, category, calories, protein, carbs, fat, fiber, sodium)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, category, calories, protein, carbs, fat, fiber, sodium]);

        const food = await db.get('SELECT * FROM nutritional_foods WHERE id = ?', result.lastID);
        res.json(food);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add food' });
    }
});

// Article routes
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await db.all(`
            SELECT a.*, u.fullName as authorName
            FROM articles a
            LEFT JOIN users u ON a.authorId = u.id
            WHERE a.published = 1
            ORDER BY a.createdAt DESC
        `);
        
        const formattedArticles = articles.map(article => ({
            ...article,
            author: { fullName: article.authorName }
        }));
        
        res.json(formattedArticles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.post('/api/articles', authenticate, requireRole(['DIETITIAN', 'ADMIN']), async (req, res) => {
    try {
        const { title, content, category } = req.body;
        
        const result = await db.run(`
            INSERT INTO articles (title, content, category, authorId, published)
            VALUES (?, ?, ?, ?, ?)
        `, [title, content, category, req.user.id, 1]);

        const article = await db.get('SELECT * FROM articles WHERE id = ?', result.lastID);
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create article' });
    }
});

// Notification routes
app.get('/api/notifications', authenticate, async (req, res) => {
    try {
        const notifications = await db.all(
            'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 20',
            req.user.id
        );
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

app.put('/api/notifications/:id/read', authenticate, async (req, res) => {
    try {
        await db.run(
            'UPDATE notifications SET read = 1 WHERE id = ? AND userId = ?',
            [req.params.id, req.user.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// Initialize database and start server
initDatabase().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running on http://${HOST}:${PORT}`);
        console.log(`📍 Accessible from: http://10.26.1.11:${PORT}`);
        console.log(`🌐 API available at http://${HOST}:${PORT}`);
        console.log(`🔒 CORS enabled for all origins`);
        console.log('\n👥 Test credentials:');
        console.log('   Dietitian - Username: dr.priya, Password: dietitian123');
        console.log('   Client - Username: rahul.kumar, Password: client123');
    });
}).catch(err => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
});