# Database Migration: SQLite to PostgreSQL

This guide covers migrating the NutriConnect database from SQLite to PostgreSQL for Vercel deployment.

## 🗄️ Migration Overview

### Current Database Structure
- **SQLite File**: `database.sqlite`
- **Tables**: users, appointments, diet_plans, articles, payments, etc.
- **Data**: User accounts, content, payment records

### Target Database
- **PostgreSQL** (Vercel Postgres)
- **Cloud-hosted** with automatic backups
- **Production-ready** with SSL encryption

## 📋 Pre-Migration Checklist

### 1. Export Current Data
```bash
# Backup current SQLite database
cp database.sqlite database.sqlite.backup

# Export data to SQL format
sqlite3 database.sqlite .dump > nutriconnect_export.sql
```

### 2. Clean Export File
```bash
# Remove SQLite-specific commands
sed -i 's/PRAGMA.*;//g' nutriconnect_export.sql
sed -i 's/BEGIN TRANSACTION;//g' nutriconnect_export.sql
sed -i 's/COMMIT;//g' nutriconnect_export.sql
```

## 🚀 PostgreSQL Schema Setup

### 1. Create PostgreSQL Schema
```sql
-- Create database
CREATE DATABASE nutriconnect;

-- Connect to database
\c nutriconnect;

-- Create tables with PostgreSQL syntax
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'client',
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    activity_level VARCHAR(50),
    dietary_restrictions TEXT,
    health_conditions TEXT,
    goals TEXT,
    emergency_contact VARCHAR(255),
    profile_picture VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id),
    dietitian_id INTEGER REFERENCES users(id),
    appointment_date TIMESTAMP NOT NULL,
    duration INTEGER DEFAULT 60,
    type VARCHAR(50) DEFAULT 'consultation',
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    meeting_link VARCHAR(500),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE diet_plans (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id),
    dietitian_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    plan_data JSONB,
    calories_per_day INTEGER,
    protein_grams DECIMAL(8,2),
    carbs_grams DECIMAL(8,2),
    fat_grams DECIMAL(8,2),
    fiber_grams DECIMAL(8,2),
    sugar_grams DECIMAL(8,2),
    sodium_mg DECIMAL(8,2),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id INTEGER REFERENCES users(id),
    category VARCHAR(100),
    tags TEXT[],
    featured_image VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    reading_time INTEGER,
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    appointment_id INTEGER REFERENCES appointments(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    invoice_number VARCHAR(100) UNIQUE,
    description TEXT,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    weight DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),
    muscle_mass DECIMAL(5,2),
    waist_circumference DECIMAL(5,2),
    notes TEXT,
    photos TEXT[],
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    appointment_id INTEGER REFERENCES appointments(id),
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_logs (
    id SERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE whatsapp_logs (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Create Indexes
```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_dietitian_id ON appointments(dietitian_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_diet_plans_client_id ON diet_plans(client_id);
CREATE INDEX idx_articles_published ON articles(is_published, published_at);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_progress_user_id ON progress_tracking(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_recipient ON chat_messages(recipient_id);
```

## 📊 Data Migration Script

Create `migrate-to-postgres.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const fs = require('fs');

async function migrateData() {
    // SQLite connection
    const sqliteDb = new sqlite3.Database('./database.sqlite');
    
    // PostgreSQL connection
    const pgClient = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    await pgClient.connect();
    
    console.log('🚀 Starting data migration...');
    
    // Migrate users
    console.log('📊 Migrating users...');
    const users = await new Promise((resolve, reject) => {
        sqliteDb.all('SELECT * FROM users', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
    
    for (const user of users) {
        await pgClient.query(`
            INSERT INTO users (
                email, password, full_name, role, phone, date_of_birth,
                gender, height, weight, activity_level, dietary_restrictions,
                health_conditions, goals, emergency_contact, profile_picture,
                two_factor_enabled, two_factor_secret, email_verified,
                created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            ) ON CONFLICT (email) DO NOTHING
        `, [
            user.email, user.password, user.full_name, user.role,
            user.phone, user.date_of_birth, user.gender, user.height,
            user.weight, user.activity_level, user.dietary_restrictions,
            user.health_conditions, user.goals, user.emergency_contact,
            user.profile_picture, user.two_factor_enabled,
            user.two_factor_secret, user.email_verified,
            user.created_at, user.updated_at
        ]);
    }
    
    // Migrate appointments
    console.log('📅 Migrating appointments...');
    const appointments = await new Promise((resolve, reject) => {
        sqliteDb.all('SELECT * FROM appointments', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
    
    for (const apt of appointments) {
        await pgClient.query(`
            INSERT INTO appointments (
                client_id, dietitian_id, appointment_date, duration,
                type, status, notes, meeting_link, price,
                created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
            apt.client_id, apt.dietitian_id, apt.appointment_date,
            apt.duration, apt.type, apt.status, apt.notes,
            apt.meeting_link, apt.price, apt.created_at, apt.updated_at
        ]);
    }
    
    // Continue with other tables...
    console.log('✅ Migration completed successfully!');
    
    await pgClient.end();
    sqliteDb.close();
}

// Run migration
migrateData().catch(console.error);
```

## 🔧 Update Application Code

### 1. Update Database Connection
```javascript
// lib/database.js
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export default pool;
```

### 2. Update Query Syntax
Replace SQLite-specific syntax:
- `AUTOINCREMENT` → `SERIAL`
- `datetime('now')` → `CURRENT_TIMESTAMP`
- `?` placeholders → `$1, $2, $3...`

## 🧪 Testing Migration

### 1. Verify Data Integrity
```sql
-- Check record counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'diet_plans', COUNT(*) FROM diet_plans
UNION ALL
SELECT 'articles', COUNT(*) FROM articles;
```

### 2. Test Application Functions
- User authentication
- Appointment booking
- Diet plan creation
- Payment processing

## 🚨 Rollback Plan

### 1. Database Backup
```bash
# Create PostgreSQL backup
pg_dump $DATABASE_URL > nutriconnect_postgres_backup.sql
```

### 2. Rollback to SQLite
```bash
# Restore SQLite database
cp database.sqlite.backup database.sqlite
```

## 📈 Post-Migration Tasks

1. **Update environment variables** in Vercel
2. **Test all API endpoints**
3. **Verify file uploads** work with Vercel storage
4. **Monitor performance** and query execution times
5. **Set up database monitoring** alerts

## 🔍 Troubleshooting

### Common Issues:
- **SSL Connection**: Ensure SSL is properly configured
- **Connection Limits**: Monitor connection pool usage
- **Query Performance**: Add missing indexes
- **Data Types**: Verify PostgreSQL type compatibility

### Performance Optimization:
- Use connection pooling
- Implement query caching
- Add database indexes
- Monitor slow queries