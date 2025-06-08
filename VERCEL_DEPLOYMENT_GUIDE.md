# 🚀 NutriConnect Vercel Deployment Guide

Complete step-by-step guide to deploy NutriConnect to Vercel with PostgreSQL database.

## 📋 Prerequisites

### 1. Required Accounts
- [Vercel Account](https://vercel.com) (free tier available)
- [GitHub Account](https://github.com) for repository hosting
- [Stripe Account](https://stripe.com) for payment processing

### 2. Local Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

## 🗄️ Database Setup

### 1. Create Vercel Postgres Database
```bash
# Navigate to project directory
cd /path/to/nutriconnect

# Create database
vercel postgres create nutriconnect-db
```

### 2. Get Database URL
```bash
# Get connection string
vercel env pull .env.local

# Your DATABASE_URL will be automatically added
```

## 📁 Repository Preparation

### 1. Create GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/yourusername/nutriconnect.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Vercel deployment

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push -u origin main
```

### 2. Required Files Checklist
- ✅ `vercel.json` - Deployment configuration
- ✅ `package.json` - Dependencies and scripts
- ✅ `.env.example` - Environment variables template
- ✅ `next.config.js` - Next.js configuration

## 🔧 Project Configuration

### 1. Update package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postbuild": "next-sitemap"
  }
}
```

### 2. Verify Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'vercel.app'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;
```

## 🌐 Deployment Steps

### 1. Connect Repository to Vercel
```bash
# Option A: Using Vercel CLI
vercel

# Option B: Using Vercel Dashboard
# 1. Go to https://vercel.com/dashboard
# 2. Click "New Project"
# 3. Import from GitHub
# 4. Select nutriconnect repository
```

### 2. Configure Environment Variables
```bash
# Set environment variables using CLI
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add WHATSAPP_API_KEY
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add JWT_SECRET
```

### 3. Database Migration
```bash
# Run migration script
node scripts/migrate-to-postgres.js

# Or use SQL directly
psql $DATABASE_URL < migrations/001_create_tables.sql
psql $DATABASE_URL < migrations/002_seed_content.sql
psql $DATABASE_URL < migrations/003_create_admin_user.sql
```

### 4. Deploy Application
```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy)
git push origin main
```

## 🔍 Verification Steps

### 1. Check Deployment Status
```bash
# Check deployment logs
vercel logs [deployment-url]

# Check build logs
vercel build-logs [deployment-url]
```

### 2. Test Application Features
1. **Homepage**: https://your-app.vercel.app
2. **Authentication**: Test login/register
3. **API Endpoints**: Test `/api/health`
4. **Database**: Verify data connectivity
5. **Payments**: Test Stripe integration
6. **Email**: Test email notifications

### 3. Performance Checks
- Lighthouse score
- Core Web Vitals
- API response times
- Database query performance

## 📊 Monitoring Setup

### 1. Vercel Analytics
```bash
# Enable analytics
vercel analytics enable
```

### 2. Error Monitoring
```javascript
// lib/monitoring.js
export function logError(error, context) {
  console.error('Application Error:', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}
```

### 3. Database Monitoring
```sql
-- Create monitoring views
CREATE VIEW active_connections AS
SELECT * FROM pg_stat_activity 
WHERE state = 'active';

CREATE VIEW slow_queries AS
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## 🔒 Security Configuration

### 1. Domain Security
```bash
# Add custom domain
vercel domains add nutriconnect.com

# Configure SSL (automatic with Vercel)
```

### 2. API Security
- Rate limiting enabled
- CORS configured
- Input validation
- SQL injection protection

### 3. Environment Security
- All secrets in environment variables
- No hardcoded credentials
- Secure headers configured

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
vercel logs --app=nutriconnect

# Common fixes:
# - Check package.json dependencies
# - Verify TypeScript types
# - Check import/export syntax
```

#### 2. Database Connection Issues
```bash
# Test database connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

#### 3. Environment Variable Issues
```bash
# List environment variables
vercel env ls

# Update environment variable
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
```

#### 4. API Route Issues
```bash
# Test API endpoint
curl https://your-app.vercel.app/api/health

# Check API logs
vercel logs --app=nutriconnect --filter=api
```

### Performance Issues

#### 1. Slow Database Queries
```sql
-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

#### 2. Large Bundle Size
```bash
# Analyze bundle
npm run build

# Use dynamic imports for large components
const LargeComponent = dynamic(() => import('./LargeComponent'));
```

## 📈 Post-Deployment Tasks

### 1. Domain Setup
```bash
# Add custom domain
vercel domains add nutriconnect.com
vercel domains add www.nutriconnect.com

# Configure DNS records
# A record: @ → 76.76.19.61
# CNAME record: www → alias.vercel.app
```

### 2. SEO Configuration
```javascript
// Update sitemap
// Update robots.txt
// Add structured data
// Configure meta tags
```

### 3. Monitoring Setup
```bash
# Set up uptime monitoring
# Configure error alerts
# Enable performance monitoring
# Set up backup schedules
```

### 4. User Communication
- Update app store listings
- Send deployment notifications
- Update documentation
- Inform support team

## 🔄 Continuous Deployment

### 1. Automatic Deployments
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 2. Environment Management
- **Development**: Auto-deploy from `develop` branch
- **Staging**: Auto-deploy from `staging` branch  
- **Production**: Auto-deploy from `main` branch

### 3. Rollback Strategy
```bash
# Rollback to previous deployment
vercel rollback [deployment-url]

# Promote specific deployment
vercel promote [deployment-url]
```

## 📞 Support Resources

### 1. Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://postgresql.org/docs)

### 2. Community Support
- Vercel Discord
- Next.js GitHub Discussions
- Stack Overflow

### 3. Professional Support
- Vercel Pro Plan support
- Enterprise support options

## ✅ Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Database migrated to PostgreSQL
- [ ] Domain configured (optional)
- [ ] SSL certificate active
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] Payment system functional
- [ ] Email notifications working
- [ ] Performance optimized
- [ ] Monitoring enabled
- [ ] Backup strategy implemented
- [ ] Team access configured
- [ ] Documentation updated

## 🎉 Success Metrics

After deployment, monitor these metrics:
- **Uptime**: 99.9% target
- **Response Time**: <200ms API responses
- **Core Web Vitals**: All green scores
- **Error Rate**: <1% of requests
- **User Satisfaction**: Monitor support tickets

Your NutriConnect platform is now live on Vercel! 🚀