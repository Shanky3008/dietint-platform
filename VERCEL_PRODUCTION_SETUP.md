# 🚀 DietInt Production Setup Guide for Vercel

## 1. Database Setup - PostgreSQL on Vercel

### Step 1: Create PostgreSQL Database
```bash
# Navigate to your Vercel project
vercel env add DATABASE_URL

# Or create through Vercel dashboard:
# 1. Go to https://vercel.com/dashboard
# 2. Select your "dietint-platform" project
# 3. Go to "Storage" tab
# 4. Click "Create Database"
# 5. Select "PostgreSQL"
# 6. Choose a name like "dietint-db"
# 7. Select a region (choose closest to your users)
```

### Step 2: Get Database Connection String
After creating the database, you'll get a connection string like:
```
postgres://username:password@hostname:port/database
```

## 2. Environment Variables Setup

### Required Environment Variables for Production:

```bash
# Core Database
DATABASE_URL=postgres://username:password@hostname:port/database

# JWT Security - CHANGE THIS!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App Configuration
NODE_ENV=production
PORT=3000

# DietInt Brand Configuration
BRAND_NAME=DietInt
BRAND_DOMAIN=dietint.com
BRAND_EMAIL=admin@dietint.com

# Payment Configuration (UPI)
UPI_ID=gouri@paytm
PAYEE_NAME=DietInt Services
MERCHANT_CODE=DIETINT001

# Email Configuration (Gmail/SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@dietint.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@dietint.com
EMAIL_ADMIN=admin@dietint.com

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://dietint.com,https://www.dietint.com

# Optional: AI Integration
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=mailto:admin@dietint.com

# Optional: WhatsApp Integration
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_ID=your-whatsapp-phone-id

# Optional: File Upload (if using cloud storage)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## 3. Setting Up Environment Variables in Vercel

### Method 1: Using Vercel CLI
```bash
# Set each variable
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add SMTP_USER
vercel env add SMTP_PASS
# ... continue for all variables
```

### Method 2: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your "dietint-platform" project
3. Go to "Settings" → "Environment Variables"
4. Add each variable one by one
5. Make sure to select "Production" environment

## 4. Database Schema Setup

### Create PostgreSQL Tables
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'client',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    dietitian_id INTEGER REFERENCES users(id),
    appointment_date TIMESTAMP NOT NULL,
    duration INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    service_name VARCHAR(255),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diet plans table
CREATE TABLE diet_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    dietitian_id INTEGER REFERENCES users(id),
    plan_name VARCHAR(255),
    description TEXT,
    meal_plan JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content management table
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_diet_plans_user_id ON diet_plans(user_id);
CREATE INDEX idx_content_section ON content(section);
```

## 5. Deployment Commands

### Deploy with Environment Variables
```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel list

# Check logs
vercel logs https://dietint-platform.vercel.app
```

## 6. Domain Setup (dietint.com)

### Add Custom Domain
```bash
# Add your domain
vercel domains add dietint.com
vercel domains add www.dietint.com

# Link domain to project
vercel alias set dietint-platform.vercel.app dietint.com
vercel alias set dietint-platform.vercel.app www.dietint.com
```

### DNS Configuration
Update your domain DNS to point to Vercel:
```
A Record: @ → 76.76.19.61
CNAME Record: www → dietint-platform.vercel.app
```

## 7. Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set up SMTP with app passwords (not regular passwords)
- [ ] Configure CORS_ORIGIN for your domain
- [ ] Set up SSL certificate (automatic with Vercel)
- [ ] Enable rate limiting
- [ ] Set up proper database user permissions

## 8. Testing Production Setup

### Test Database Connection
```bash
# Test from local environment
npm run build
npm start

# Or deploy and test
vercel --prod
```

### Test Email Functionality
- Send test registration email
- Test password reset
- Verify appointment notifications

### Test Payment Integration
- Test UPI payment flow
- Verify payment status updates
- Check payment history

## 9. Monitoring and Maintenance

### Set up Monitoring
- Enable Vercel Analytics
- Set up error tracking
- Monitor database performance
- Set up uptime monitoring

### Regular Maintenance
- Monitor database size
- Update dependencies
- Check security vulnerabilities
- Backup database regularly

## 10. Support and Documentation

### Resources
- Vercel Documentation: https://vercel.com/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Next.js Documentation: https://nextjs.org/docs

### Support Contacts
- Technical Support: support@dietint.com
- Admin Contact: admin@dietint.com
- Developer: gouri@dietint.com

---

## Quick Start Commands Summary

```bash
# 1. Create database in Vercel dashboard
# 2. Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add SMTP_USER
vercel env add SMTP_PASS

# 3. Deploy to production
vercel --prod

# 4. Set up custom domain
vercel domains add dietint.com
vercel alias set dietint-platform.vercel.app dietint.com
```

**Your DietInt platform is now ready for production! 🎉**