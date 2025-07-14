# 🚀 DietInt Deployment Commands

Quick reference for deploying DietInt to Vercel production.

## 🔧 Prerequisites Setup

### 1. Install Required Tools
```bash
# Install Vercel CLI globally
npm install -g vercel

# Install PostgreSQL client (for database operations)
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# Verify installations
vercel --version
psql --version
```

### 2. Login to Vercel
```bash
# Login with your Vercel account
vercel login

# Verify login
vercel whoami
```

## 📁 Project Preparation

### 1. Navigate to Project Directory
```bash
# Go to the New folder which contains the complete application
cd /home/bhavani/Nutriconnect/New
```

### 2. Initialize Git Repository
```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: DietInt - Diet Intelligence & Interaction Platform

Features:
- Complete nutrition intelligence platform
- Interactive dietitian consultations
- AI-powered diet recommendations
- Appointment booking and video calls
- Progress tracking and analytics
- Payment processing integration
- PWA support with offline functionality
- Mobile-responsive design
- Admin dashboard and content management

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 3. Create GitHub Repository
```bash
# Create repository on GitHub (replace with your username)
# Visit: https://github.com/new
# Repository name: dietint-platform
# Description: DietInt - Diet Intelligence & Interaction Platform

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/dietint-platform.git

# Push to GitHub
git push -u origin main
```

## 🗄️ Database Setup Commands

### 1. Create Vercel Postgres Database
```bash
# Create PostgreSQL database
vercel postgres create dietint-production

# Note: Save the connection details shown
```

### 2. Get Database Connection String
```bash
# Pull environment variables (includes DATABASE_URL)
vercel env pull .env.production

# View the DATABASE_URL
cat .env.production | grep DATABASE_URL
```

### 3. Run Database Migrations
```bash
# Install PostgreSQL npm package for migration
npm install pg

# Create migration script
cat > migrate-to-postgres.js << 'EOF'
const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const fs = require('fs');

async function migrateData() {
    console.log('🚀 Starting database migration...');
    
    // PostgreSQL connection
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Create tables
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'client',
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            client_id INTEGER REFERENCES users(id),
            dietitian_id INTEGER REFERENCES users(id),
            appointment_date TIMESTAMP NOT NULL,
            status VARCHAR(50) DEFAULT 'scheduled',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS diet_plans (
            id SERIAL PRIMARY KEY,
            client_id INTEGER REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            plan_data JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            author_id INTEGER REFERENCES users(id),
            is_published BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    
    // Create admin user
    await client.query(`
        INSERT INTO users (email, password, full_name, role)
        VALUES ('admin@nutriconnect.com', '$2b$10$8K0Vs8LQkWj5EwN3zJ9mEuGzT1nG7yG2hF4sR8bY6vX3mC1qA5bN2', 'NutriConnect Admin', 'admin')
        ON CONFLICT (email) DO NOTHING;
    `);
    
    console.log('✅ Database migration completed');
    await client.end();
}

// Load environment variables and run migration
require('dotenv').config({ path: '.env.production' });
migrateData().catch(console.error);
EOF

# Run migration
node migrate-to-postgres.js
```

## 🌐 Vercel Deployment Commands

### 1. Initial Deployment Setup
```bash
# Initialize Vercel project
vercel

# Follow prompts:
# ? Set up and deploy "~/Nutriconnect/New"? [Y/n] y
# ? Which scope should contain your project? [Use arrows to move, type to filter]
# ? What's your project's name? nutriconnect-platform
# ? In which directory is your code located? ./
```

### 2. Configure Environment Variables
```bash
# Add all required environment variables
vercel env add DATABASE_URL production
# Paste your PostgreSQL connection string

vercel env add NEXTAUTH_SECRET production
# Enter: a-very-secure-random-string-for-jwt-signing

vercel env add NEXTAUTH_URL production  
# Enter: https://nutriconnect-platform.vercel.app

vercel env add STRIPE_SECRET_KEY production
# Enter your Stripe secret key: sk_live_...

vercel env add STRIPE_PUBLISHABLE_KEY production
# Enter your Stripe publishable key: pk_live_...

vercel env add STRIPE_WEBHOOK_SECRET production
# Enter your Stripe webhook secret: whsec_...

vercel env add EMAIL_HOST production
# Enter: smtp.gmail.com

vercel env add EMAIL_PORT production
# Enter: 587

vercel env add EMAIL_USER production  
# Enter: your-email@gmail.com

vercel env add EMAIL_PASS production
# Enter: your-app-password

vercel env add WHATSAPP_API_KEY production
# Enter your WhatsApp Business API key

vercel env add ADMIN_EMAIL production
# Enter: admin@nutriconnect.com

vercel env add ADMIN_PASSWORD production
# Enter: secure-admin-password

vercel env add JWT_SECRET production
# Enter: another-very-secure-random-string
```

### 3. Deploy to Production
```bash
# Deploy to production
vercel --prod

# Your application will be available at:
# https://nutriconnect-platform.vercel.app
```

## 🔍 Verification Commands

### 1. Test Deployment
```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Test API endpoints
curl https://nutriconnect-platform.vercel.app/api/health
curl https://nutriconnect-platform.vercel.app/api/auth/me
```

### 2. Database Verification
```bash
# Test database connection
vercel env pull .env.production
node -e "
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
client.connect().then(() => {
  return client.query('SELECT COUNT(*) FROM users');
}).then(res => {
  console.log('Users count:', res.rows[0].count);
  client.end();
}).catch(console.error);
"
```

### 3. Application Testing
```bash
# Test main pages
curl -I https://nutriconnect-platform.vercel.app/
curl -I https://nutriconnect-platform.vercel.app/auth/login
curl -I https://nutriconnect-platform.vercel.app/dashboard
curl -I https://nutriconnect-platform.vercel.app/admin

# Test API endpoints
curl https://nutriconnect-platform.vercel.app/api/health
curl -X POST https://nutriconnect-platform.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass","fullName":"Test User"}'
```

## 🔄 Continuous Deployment Commands

### 1. Setup Automatic Deployment
```bash
# Any push to main branch will trigger deployment
git add .
git commit -m "Update: Feature improvements

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

# Vercel will automatically deploy
```

### 2. Manual Redeploy
```bash
# Force redeploy current version
vercel --prod --force

# Deploy specific git commit
vercel --prod --meta gitCommitSha=abc123
```

### 3. Rollback Commands
```bash
# List previous deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]

# Promote specific deployment to production
vercel promote [deployment-url] --scope=production
```

## 🎯 Domain Configuration Commands

### 1. Add Custom Domain
```bash
# Add your custom domain
vercel domains add nutriconnect.com
vercel domains add www.nutriconnect.com

# Configure domain for project
vercel alias nutriconnect-platform.vercel.app nutriconnect.com
vercel alias nutriconnect-platform.vercel.app www.nutriconnect.com
```

### 2. SSL Certificate
```bash
# SSL is automatically handled by Vercel
# Verify SSL status
curl -I https://nutriconnect.com
```

## 📊 Monitoring Commands

### 1. Enable Analytics
```bash
# Enable Vercel Analytics
vercel analytics enable

# Enable Web Vitals monitoring
vercel vitals enable
```

### 2. View Logs and Metrics
```bash
# Real-time logs
vercel logs --follow

# Function logs
vercel logs --limit=100

# View analytics
vercel analytics
```

## 🚨 Troubleshooting Commands

### 1. Debug Build Issues
```bash
# Run local build to test
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Test locally with production settings
vercel dev --prod
```

### 2. Debug Environment Variables
```bash
# List all environment variables
vercel env ls

# Test specific environment variable
vercel env ls | grep DATABASE_URL

# Update environment variable
vercel env rm DATABASE_URL production
vercel env add DATABASE_URL production
```

### 3. Debug Function Issues
```bash
# Test function locally
vercel dev

# View function logs
vercel logs --filter=api

# Check function configuration
cat vercel.json | jq '.functions'
```

## ⚡ Quick Commands Summary

```bash
# Complete deployment in one go:
cd /home/bhavani/Nutriconnect/New
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nutriconnect-platform.git
git push -u origin main
vercel --prod
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
# ... add other environment variables
curl https://your-deployment-url.vercel.app/api/health
```

## 🎉 Success Confirmation

Your NutriConnect platform should now be live at:
- **Production URL**: https://nutriconnect-platform.vercel.app
- **Custom Domain** (if configured): https://nutriconnect.com

Test these critical features:
1. ✅ Homepage loads correctly
2. ✅ User registration/login works
3. ✅ Admin dashboard accessible
4. ✅ API endpoints respond
5. ✅ Database connectivity confirmed
6. ✅ Payment processing functional
7. ✅ Email notifications working
8. ✅ PWA install prompt appears

Your dietitian platform is now production-ready and deployed! 🚀