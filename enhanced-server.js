// Enhanced NutriConnect Server - Hybrid Implementation
// Combines the simplicity of the original with advanced features from NutriConnect
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import webpush from 'web-push';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Configuration
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Create necessary directories
const dirs = ['uploads', 'uploads/profiles', 'uploads/documents', 'uploads/invoices'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Enhanced Multer setup with file type validation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'profileImage') uploadPath += 'profiles/';
        else if (file.fieldname === 'document') uploadPath += 'documents/';
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = {
        'profileImage': ['image/jpeg', 'image/png', 'image/webp'],
        'document': ['application/pdf', 'image/jpeg', 'image/png']
    };
    
    if (allowedTypes[file.fieldname]?.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}`), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Database setup with enhanced schema
let db;

const initDatabase = async () => {
    try {
        db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });

        // Enable foreign keys
        await db.exec('PRAGMA foreign_keys = ON');

        // Create comprehensive database schema
        await db.exec(`
            -- Users table with enhanced fields
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                fullName TEXT NOT NULL,
                phone TEXT,
                role TEXT DEFAULT 'CLIENT' CHECK(role IN ('CLIENT', 'DIETITIAN', 'ADMIN')),
                age INTEGER,
                gender TEXT CHECK(gender IN ('MALE', 'FEMALE', 'OTHER')),
                dateOfBirth TEXT,
                weight REAL,
                height REAL,
                bmi REAL,
                activityLevel TEXT DEFAULT 'SEDENTARY',
                healthGoals TEXT,
                medicalConditions TEXT,
                allergies TEXT,
                dietaryPreferences TEXT,
                emergencyContact TEXT,
                profileImage TEXT,
                
                -- Enhanced security fields
                twoFactorEnabled INTEGER DEFAULT 0,
                twoFactorSecret TEXT,
                twoFactorBackupCodes TEXT,
                lastLogin TEXT,
                loginAttempts INTEGER DEFAULT 0,
                accountLocked INTEGER DEFAULT 0,
                
                -- Verification fields
                emailVerified INTEGER DEFAULT 0,
                phoneVerified INTEGER DEFAULT 0,
                verificationToken TEXT,
                
                -- Timestamps
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
            );

            -- Appointments with enhanced features
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                dietitianId INTEGER,
                date TEXT NOT NULL,
                timeSlot TEXT NOT NULL,
                duration INTEGER DEFAULT 60,
                status TEXT DEFAULT 'SCHEDULED' CHECK(status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
                type TEXT NOT NULL CHECK(type IN ('INITIAL_CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'VIDEO_CALL', 'PHONE_CALL')),
                meetingLink TEXT,
                notes TEXT,
                clientNotes TEXT,
                reminderSent INTEGER DEFAULT 0,
                rating INTEGER CHECK(rating BETWEEN 1 AND 5),
                feedback TEXT,
                amount REAL,
                paid INTEGER DEFAULT 0,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (dietitianId) REFERENCES users(id) ON DELETE SET NULL
            );

            -- Enhanced diet plans
            CREATE TABLE IF NOT EXISTS diet_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                createdBy INTEGER,
                title TEXT NOT NULL,
                description TEXT,
                goals TEXT,
                duration INTEGER, -- in days
                targetCalories INTEGER,
                targetProtein INTEGER,
                targetCarbs INTEGER,
                targetFat INTEGER,
                targetFiber INTEGER,
                targetSugar INTEGER,
                restrictions TEXT, -- JSON array of restrictions
                status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
                meals TEXT, -- JSON object with meal plans
                instructions TEXT,
                startDate TEXT,
                endDate TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
            );

            -- Progress tracking
            CREATE TABLE IF NOT EXISTS progress_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                date TEXT NOT NULL,
                weight REAL,
                bodyFat REAL,
                muscleMass REAL,
                bmi REAL,
                measurements TEXT, -- JSON object with various measurements
                photos TEXT, -- JSON array of photo URLs
                notes TEXT,
                mood TEXT,
                energyLevel INTEGER CHECK(energyLevel BETWEEN 1 AND 10),
                sleepHours REAL,
                waterIntake REAL,
                exerciseMinutes INTEGER,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );

            -- Enhanced payments
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                appointmentId INTEGER,
                dietPlanId INTEGER,
                amount REAL NOT NULL,
                currency TEXT DEFAULT 'INR',
                type TEXT NOT NULL CHECK(type IN ('CONSULTATION', 'DIET_PLAN', 'SUBSCRIPTION', 'PRODUCT')),
                status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED')),
                paymentMethod TEXT CHECK(paymentMethod IN ('UPI', 'CARD', 'BANK_TRANSFER', 'CASH', 'WALLET')),
                transactionId TEXT UNIQUE,
                upiId TEXT,
                payerVPA TEXT,
                reference TEXT,
                invoiceGenerated INTEGER DEFAULT 0,
                invoicePath TEXT,
                dueDate TEXT,
                paidAt TEXT,
                description TEXT,
                metadata TEXT, -- JSON for additional payment data
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE SET NULL,
                FOREIGN KEY (dietPlanId) REFERENCES diet_plans(id) ON DELETE SET NULL
            );

            -- Food database
            CREATE TABLE IF NOT EXISTS foods (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT,
                brand TEXT,
                servingSize REAL DEFAULT 100,
                servingUnit TEXT DEFAULT 'g',
                calories REAL NOT NULL,
                protein REAL DEFAULT 0,
                carbs REAL DEFAULT 0,
                fat REAL DEFAULT 0,
                fiber REAL DEFAULT 0,
                sugar REAL DEFAULT 0,
                sodium REAL DEFAULT 0,
                vitamins TEXT, -- JSON object
                minerals TEXT, -- JSON object
                allergens TEXT, -- JSON array
                isVerified INTEGER DEFAULT 0,
                barcode TEXT,
                image TEXT,
                description TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            );

            -- AI Recommendations
            CREATE TABLE IF NOT EXISTS ai_recommendations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('DIET', 'EXERCISE', 'LIFESTYLE', 'SUPPLEMENT')),
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                confidence REAL CHECK(confidence BETWEEN 0 AND 1),
                priority TEXT DEFAULT 'MEDIUM' CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
                category TEXT,
                actionable_steps TEXT, -- JSON array
                expected_outcome TEXT,
                timeframe TEXT,
                status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'DISMISSED', 'COMPLETED', 'EXPIRED')),
                feedback TEXT,
                rating INTEGER CHECK(rating BETWEEN 1 AND 5),
                viewed INTEGER DEFAULT 0,
                viewedAt TEXT,
                expiresAt TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );

            -- Articles and educational content
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                author INTEGER,
                category TEXT,
                tags TEXT, -- JSON array
                featuredImage TEXT,
                status TEXT DEFAULT 'PUBLISHED' CHECK(status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
                readTime INTEGER, -- in minutes
                views INTEGER DEFAULT 0,
                likes INTEGER DEFAULT 0,
                publishedAt TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (author) REFERENCES users(id) ON DELETE SET NULL
            );

            -- Push notification subscriptions
            CREATE TABLE IF NOT EXISTS push_subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                endpoint TEXT NOT NULL,
                p256dh TEXT NOT NULL,
                auth TEXT NOT NULL,
                userAgent TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );

            -- System notifications
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                type TEXT NOT NULL CHECK(type IN ('APPOINTMENT', 'PAYMENT', 'SYSTEM', 'PROMOTION', 'REMINDER')),
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                data TEXT, -- JSON object with additional data
                read INTEGER DEFAULT 0,
                actionUrl TEXT,
                expiresAt TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );

            -- Create indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
            CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(userId);
            CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
            CREATE INDEX IF NOT EXISTS idx_diet_plans_user ON diet_plans(userId);
            CREATE INDEX IF NOT EXISTS idx_progress_logs_user ON progress_logs(userId);
            CREATE INDEX IF NOT EXISTS idx_progress_logs_date ON progress_logs(date);
            CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(userId);
            CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
            CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user ON ai_recommendations(userId);
            CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(userId);
        `);

        // Seed database with initial data
        await seedDatabase();
        
        console.log('✅ Enhanced database initialized successfully');
        console.log('📊 Database location: ./database.sqlite');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

// Enhanced seed function with comprehensive test data
const seedDatabase = async () => {
    try {
        // Check if users exist
        const userCount = await db.get('SELECT COUNT(*) as count FROM users');
        if (userCount.count > 0) {
            console.log('📊 Database already seeded, skipping...');
            return;
        }

        console.log('🌱 Seeding database with initial data...');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 12);
        await db.run(`
            INSERT INTO users (username, password, email, fullName, role, phone, age, gender, weight, height, profileImage, emailVerified, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, ['admin', adminPassword, 'admin@nutriconnect.com', 'System Administrator', 'ADMIN', '+91-9999999999', 30, 'OTHER', 70, 175, null, 1, new Date().toISOString()]);

        // Create dietitian
        const dietitianPassword = await bcrypt.hash('dietitian123', 12);
        await db.run(`
            INSERT INTO users (username, password, email, fullName, role, phone, age, gender, weight, height, profileImage, emailVerified, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, ['dr.priya', dietitianPassword, 'priya@nutriconnect.com', 'Dr. Priya Sharma', 'DIETITIAN', '+91-9876543210', 35, 'FEMALE', 60, 165, null, 1, new Date().toISOString()]);

        // Create client
        const clientPassword = await bcrypt.hash('client123', 12);
        await db.run(`
            INSERT INTO users (username, password, email, fullName, role, phone, age, gender, weight, height, bmi, activityLevel, healthGoals, profileImage, emailVerified, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, ['rahul.kumar', clientPassword, 'rahul@example.com', 'Rahul Kumar', 'CLIENT', '+91-9876543211', 28, 'MALE', 75, 175, 24.49, 'MODERATE', 'Weight loss and muscle gain', null, 1, new Date().toISOString()]);

        // Add sample foods
        const foods = [
            ['Rice (Basmati)', 'Grains', null, 100, 'g', 365, 7.1, 78, 0.9, 1.3, 0.1, 5],
            ['Chicken Breast', 'Protein', null, 100, 'g', 165, 31, 0, 3.6, 0, 0, 74],
            ['Spinach', 'Vegetables', null, 100, 'g', 23, 2.9, 3.6, 0.4, 2.2, 0.4, 79],
            ['Apple', 'Fruits', null, 100, 'g', 52, 0.3, 14, 0.2, 2.4, 10, 1],
            ['Almonds', 'Nuts', null, 100, 'g', 579, 21, 22, 50, 12, 4, 1],
            ['Salmon', 'Protein', null, 100, 'g', 208, 20, 0, 13, 0, 0, 93],
            ['Sweet Potato', 'Vegetables', null, 100, 'g', 86, 1.6, 20, 0.1, 3, 4.2, 5],
            ['Greek Yogurt', 'Dairy', null, 100, 'g', 59, 10, 3.6, 0.4, 0, 3.2, 36]
        ];

        for (const food of foods) {
            await db.run(`
                INSERT INTO foods (name, category, brand, servingSize, servingUnit, calories, protein, carbs, fat, fiber, sugar, sodium, isVerified) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [...food, 1]);
        }

        // Add sample articles
        const articles = [
            {
                title: 'The Complete Guide to Balanced Nutrition',
                slug: 'complete-guide-balanced-nutrition',
                content: `
                <h2>Understanding Balanced Nutrition</h2>
                <p>A balanced diet is crucial for maintaining good health and well-being. It involves consuming the right amounts of nutrients your body needs to function properly.</p>
                
                <h3>Key Components of a Balanced Diet</h3>
                <ul>
                    <li><strong>Carbohydrates:</strong> 45-65% of total calories</li>
                    <li><strong>Proteins:</strong> 10-35% of total calories</li>
                    <li><strong>Fats:</strong> 20-35% of total calories</li>
                    <li><strong>Vitamins and Minerals:</strong> Essential micronutrients</li>
                    <li><strong>Water:</strong> 8-10 glasses per day</li>
                </ul>

                <h3>Benefits of Balanced Nutrition</h3>
                <p>Following a balanced diet can help you:</p>
                <ul>
                    <li>Maintain a healthy weight</li>
                    <li>Reduce risk of chronic diseases</li>
                    <li>Improve energy levels</li>
                    <li>Enhance mental clarity</li>
                    <li>Support immune function</li>
                </ul>
                `,
                excerpt: 'Learn the fundamentals of balanced nutrition and how to create healthy eating habits that last.',
                category: 'Nutrition Basics',
                tags: '["nutrition", "diet", "health", "wellness"]',
                readTime: 8
            },
            {
                title: 'Weight Loss: Science-Based Strategies That Work',
                slug: 'weight-loss-science-based-strategies',
                content: `
                <h2>Evidence-Based Weight Loss</h2>
                <p>Sustainable weight loss requires a scientific approach combining proper nutrition, exercise, and lifestyle changes.</p>
                
                <h3>The Fundamentals</h3>
                <p>Weight loss occurs when you create a caloric deficit - burning more calories than you consume. However, the quality of calories matters just as much as the quantity.</p>

                <h3>Proven Strategies</h3>
                <ol>
                    <li><strong>Track Your Food Intake:</strong> Use apps or journals to monitor calories and nutrients</li>
                    <li><strong>Eat Protein at Every Meal:</strong> Helps preserve muscle mass and increases satiety</li>
                    <li><strong>Include Fiber-Rich Foods:</strong> Promotes fullness and digestive health</li>
                    <li><strong>Stay Hydrated:</strong> Often hunger is actually thirst</li>
                    <li><strong>Get Adequate Sleep:</strong> Poor sleep disrupts hunger hormones</li>
                </ol>
                `,
                excerpt: 'Discover scientifically-proven strategies for sustainable weight loss and long-term health.',
                category: 'Weight Management',
                tags: '["weight-loss", "calories", "metabolism", "exercise"]',
                readTime: 6
            }
        ];

        for (const article of articles) {
            await db.run(`
                INSERT INTO articles (title, slug, content, excerpt, author, category, tags, readTime, status, publishedAt, createdAt) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [article.title, article.slug, article.content, article.excerpt, 2, article.category, article.tags, article.readTime, 'PUBLISHED', new Date().toISOString(), new Date().toISOString()]);
        }

        console.log('✅ Database seeded successfully with enhanced data');

    } catch (error) {
        console.error('❌ Database seeding failed:', error);
    }
};

// Validation schemas using Zod
const schemas = {
    register: z.object({
        username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, hyphens and underscores'),
        password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
        email: z.string().email('Invalid email format'),
        fullName: z.string().min(2).max(100),
        phone: z.string().optional(),
        age: z.number().min(13).max(120).optional(),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
        weight: z.number().min(20).max(300).optional(),
        height: z.number().min(100).max(250).optional()
    }),
    
    login: z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(1, 'Password is required')
    }),

    appointment: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
        type: z.enum(['INITIAL_CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'VIDEO_CALL', 'PHONE_CALL']),
        notes: z.string().optional()
    }),

    progressLog: z.object({
        weight: z.number().min(20).max(300).optional(),
        bodyFat: z.number().min(1).max(50).optional(),
        muscleMass: z.number().min(10).max(100).optional(),
        notes: z.string().optional(),
        mood: z.string().optional(),
        energyLevel: z.number().min(1).max(10).optional(),
        sleepHours: z.number().min(0).max(24).optional(),
        waterIntake: z.number().min(0).max(10).optional(),
        exerciseMinutes: z.number().min(0).max(1440).optional()
    })
};

// Enhanced authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', async (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired' });
                }
                return res.status(403).json({ error: 'Invalid token' });
            }

            // Get fresh user data
            const dbUser = await db.get('SELECT * FROM users WHERE id = ?', [user.userId]);
            if (!dbUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (dbUser.accountLocked) {
                return res.status(423).json({ error: 'Account is locked' });
            }

            req.user = dbUser;
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Role-based authorization middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: err.errors 
        });
    }

    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ 
            error: 'Resource already exists',
            field: err.message.includes('email') ? 'email' : 'username'
        });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large' });
    }

    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

// Helper function to calculate BMI
const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 100) / 100;
};

// Helper function to generate invoices
const generateInvoice = async (paymentId) => {
    try {
        const payment = await db.get(`
            SELECT p.*, u.fullName, u.email, a.date, a.timeSlot, a.type, dp.title as dietPlanTitle
            FROM payments p
            JOIN users u ON p.userId = u.id
            LEFT JOIN appointments a ON p.appointmentId = a.id
            LEFT JOIN diet_plans dp ON p.dietPlanId = dp.id
            WHERE p.id = ?
        `, [paymentId]);

        if (!payment) return null;

        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice #${payment.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .invoice-details { margin: 20px 0; }
                    .amount { font-size: 24px; font-weight: bold; color: #2563eb; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🥗 NutriConnect</h1>
                    <h2>INVOICE</h2>
                    <p>Invoice #: ${payment.id} | Date: ${new Date(payment.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div class="invoice-details">
                    <h3>Bill To:</h3>
                    <p><strong>${payment.fullName}</strong><br>
                    Email: ${payment.email}<br>
                    Payment ID: ${payment.transactionId || 'N/A'}</p>
                    
                    <h3>Service Details:</h3>
                    <p>Type: ${payment.type}<br>
                    ${payment.date ? `Appointment: ${payment.date} at ${payment.timeSlot}` : ''}
                    ${payment.dietPlanTitle ? `Diet Plan: ${payment.dietPlanTitle}` : ''}
                    Description: ${payment.description || 'Professional nutrition services'}</p>
                    
                    <h3>Payment Summary:</h3>
                    <p class="amount">Amount: ₹${payment.amount}</p>
                    <p>Status: ${payment.status}<br>
                    Payment Method: ${payment.paymentMethod}<br>
                    ${payment.paidAt ? `Paid On: ${new Date(payment.paidAt).toLocaleString()}` : ''}</p>
                </div>
                
                <div style="text-align: center; margin-top: 40px; color: #666;">
                    <p>Thank you for choosing NutriConnect!<br>
                    For any queries, contact us at support@nutriconnect.com</p>
                </div>
            </body>
            </html>
        `;

        const invoicePath = `uploads/invoices/invoice-${paymentId}.html`;
        fs.writeFileSync(invoicePath, invoiceHTML);
        
        await db.run('UPDATE payments SET invoiceGenerated = 1, invoicePath = ? WHERE id = ?', [invoicePath, paymentId]);
        
        return invoicePath;
    } catch (error) {
        console.error('Invoice generation error:', error);
        return null;
    }
};

// API Routes

// Authentication routes
app.post('/api/auth/register', async (req, res, next) => {
    try {
        const validatedData = schemas.register.parse(req.body);
        
        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12);
        
        // Calculate BMI if weight and height provided
        let bmi = null;
        if (validatedData.weight && validatedData.height) {
            bmi = calculateBMI(validatedData.weight, validatedData.height);
        }

        const result = await db.run(`
            INSERT INTO users (username, password, email, fullName, phone, age, gender, weight, height, bmi, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            validatedData.username,
            hashedPassword,
            validatedData.email,
            validatedData.fullName,
            validatedData.phone || null,
            validatedData.age || null,
            validatedData.gender || null,
            validatedData.weight || null,
            validatedData.height || null,
            bmi,
            new Date().toISOString(),
            new Date().toISOString()
        ]);

        const token = jwt.sign(
            { userId: result.lastID, username: validatedData.username, role: 'CLIENT' },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.lastID,
                username: validatedData.username,
                email: validatedData.email,
                fullName: validatedData.fullName,
                role: 'CLIENT'
            }
        });
    } catch (error) {
        next(error);
    }
});

app.post('/api/auth/login', async (req, res, next) => {
    try {
        const { username, password } = schemas.login.parse(req.body);

        const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.accountLocked) {
            return res.status(423).json({ error: 'Account is locked due to too many failed login attempts' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            // Increment login attempts
            await db.run('UPDATE users SET loginAttempts = loginAttempts + 1 WHERE id = ?', [user.id]);
            
            // Lock account after 5 failed attempts
            if (user.loginAttempts >= 4) {
                await db.run('UPDATE users SET accountLocked = 1 WHERE id = ?', [user.id]);
                return res.status(423).json({ error: 'Account locked due to too many failed attempts' });
            }
            
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Reset login attempts and update last login
        await db.run('UPDATE users SET loginAttempts = 0, lastLogin = ? WHERE id = ?', [new Date().toISOString(), user.id]);

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                profileImage: user.profileImage,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        next(error);
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    const { password, twoFactorSecret, ...userWithoutSensitive } = req.user;
    res.json({ user: userWithoutSensitive });
});

// User profile management
app.get('/api/users/profile', authenticateToken, async (req, res, next) => {
    try {
        const { password, twoFactorSecret, twoFactorBackupCodes, ...profile } = req.user;
        res.json({ profile });
    } catch (error) {
        next(error);
    }
});

app.put('/api/users/profile', authenticateToken, upload.single('profileImage'), async (req, res, next) => {
    try {
        const updateData = { ...req.body };
        
        if (req.file) {
            updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        // Calculate BMI if weight and height are provided
        if (updateData.weight && updateData.height) {
            updateData.bmi = calculateBMI(parseFloat(updateData.weight), parseFloat(updateData.height));
        }

        // Build dynamic update query
        const fields = Object.keys(updateData).filter(key => key !== 'id');
        const values = fields.map(field => updateData[field]);
        const setClause = fields.map(field => `${field} = ?`).join(', ');

        await db.run(`UPDATE users SET ${setClause}, updatedAt = ? WHERE id = ?`, 
            [...values, new Date().toISOString(), req.user.id]);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
});

// Continue with more routes...
console.log('🚀 Enhanced NutriConnect Server initialized');
console.log('📊 Features: Authentication, Authorization, File Upload, Validation');
console.log('🔒 Security: Helmet, Rate Limiting, Input Validation, Secure Headers');

export { app, initDatabase };