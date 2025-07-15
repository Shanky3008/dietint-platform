# Vercel Deployment Guide for DietInt

## 🚀 Pre-deployment Checklist

### ✅ Completed Tasks
- [x] All branding updated to DietInt
- [x] Real testimonials from gouripriyadiet.com integrated
- [x] Database migrated to PostgreSQL
- [x] All API routes use PostgreSQL syntax
- [x] Build tested successfully
- [x] Environment variables configured

## 📋 Step-by-Step Deployment

### 1. Delete Existing Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your existing project
3. Go to Settings → General → Delete Project
4. Confirm deletion

### 2. Set up PostgreSQL Database
Choose one of these options:

#### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Choose "Postgres" → "Continue"
4. Name: `dietint-db` → "Create"
5. Copy the connection string

#### Option B: Supabase
1. Go to [Supabase](https://supabase.com)
2. Create new project: `dietint-db`
3. Go to Settings → Database → Connection string
4. Copy the connection string

### 3. Initialize Database Schema
Connect to your PostgreSQL database and run these files in order:

```sql
-- 1. Run migrations/001_create_tables.sql
-- 2. Run migrations/002_seed_content.sql  
-- 3. Run migrations/003_create_admin_user.sql
-- 4. Run migrations/004_email_logs.sql
-- 5. Run migrations/005_whatsapp_logs.sql
-- 6. Run migrations/006_sample_data.sql
```

### 4. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 5. Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:

```bash
# Database (REQUIRED)
POSTGRES_URL=postgresql://username:password@host:port/database

# Authentication (REQUIRED)
JWT_SECRET=dietint-super-secret-jwt-key-2024-production

# Basic Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment (Optional)
UPI_ID=dietint@paytm
PAYEE_NAME=DietInt Services
MERCHANT_CODE=DIETINT001

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 6. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your deployed URL

## 🔧 Post-Deployment Testing

### Test User Journey
1. **Homepage**: Check branding and testimonials
2. **Register**: Create a new account
3. **Login**: Sign in with the created account
4. **Dashboard**: Verify user dashboard loads
5. **Admin**: Test admin functionality (if applicable)

### Test Database
1. Register a new user
2. Check if user appears in database
3. Test login with the created user
4. Verify JWT token generation

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify POSTGRES_URL is correct
- Check if database is accessible from Vercel
- Ensure SSL is enabled for production

#### Build Failures
- Check if all dependencies are in package.json
- Verify TypeScript compilation
- Run `npm run build` locally first

#### Authentication Issues
- Verify JWT_SECRET is set
- Check if users table exists
- Verify password hashing works

### Debugging Commands
```bash
# Test database connection
npm run build

# Check environment variables
console.log(process.env.POSTGRES_URL)

# Test API routes
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

## 📊 Performance Optimization

### Already Implemented
- ✅ PostgreSQL connection pooling
- ✅ Next.js optimization
- ✅ API route caching
- ✅ Image optimization
- ✅ Code splitting

### Monitor Performance
1. Check Vercel Analytics
2. Monitor database queries
3. Track API response times
4. Monitor user registration/login success rates

## 🔐 Security Features

### Implemented
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection

## 🚨 Important Notes

1. **Database**: The local SQLite file is NOT used in production
2. **Environment**: All sensitive data is in environment variables
3. **Domain**: Update social media links to your actual domain
4. **SSL**: Vercel provides SSL automatically
5. **Monitoring**: Set up error tracking for production

## 🎯 Success Criteria

✅ **Deployment successful** when:
- Homepage loads with DietInt branding
- User registration works
- User login works
- Dashboard displays correctly
- Database queries execute successfully
- All API routes respond correctly

Your DietInt application is now ready for production! 🎉