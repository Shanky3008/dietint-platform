# 🚀 Railway.app Deployment Guide for NutriConnect

Railway is a modern deployment platform that's perfect for full-stack applications like NutriConnect. It offers great developer experience with minimal configuration.

## 📋 Prerequisites

- GitHub account with your NutriConnect code
- Railway account (free at [railway.app](https://railway.app))

## 🚂 Step 1: Set Up Railway Project

1. **Login to Railway Dashboard**
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Connect your NutriConnect repository**
5. **Railway will auto-detect it's a Node.js project**

## 🗄️ Step 2: Add PostgreSQL Database

1. **In your Railway project dashboard**
2. **Click "New Service"**
3. **Select "Database"**
4. **Choose "PostgreSQL"**
5. **Railway will automatically create and connect the database**

## ⚙️ Step 3: Configure Environment Variables

### Automatic Database Connection
Railway automatically sets these variables:
- `DATABASE_URL`
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Add Custom Variables

In your Railway service settings, add:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=NutriWise
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app

# Security (CRITICAL)
JWT_SECRET=your-super-secure-random-string-min-32-characters

# CORS
ALLOWED_ORIGINS=https://your-app.up.railway.app

# Payment Integration
UPI_ID=your-upi-id@paytm
PAYEE_NAME=Your Business Name
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_SECRET=your-secret

# Email (optional)
RESEND_API_KEY=your-resend-key
FROM_EMAIL=noreply@your-domain.com
```

## 🔧 Step 4: Configure Build Settings

Create `railway.json` in your project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 📦 Step 5: Update Package.json

Ensure your `package.json` has the correct scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "node server-production.js",
    "migrate": "node scripts/migrate.js"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

## 🔧 Step 6: Configure Deployment

### Option A: Automatic Deployment (Recommended)

1. **Railway auto-detects your settings**
2. **Push to GitHub triggers deployment**
3. **No additional configuration needed**

### Option B: Manual Configuration

If auto-detection doesn't work:

1. **Go to Service Settings**
2. **Set Build Command**: `npm install && npm run build`
3. **Set Start Command**: `npm start`
4. **Set Root Directory**: `/` (or your project folder)

## 🌐 Step 7: Custom Domain (Optional)

1. **Go to Service Settings**
2. **Click "Domains"**
3. **Add custom domain**
4. **Configure DNS with provided CNAME**
5. **Update environment variables**:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
   ALLOWED_ORIGINS=https://your-custom-domain.com
   ```

## 🔍 Step 8: Database Migrations

Railway will run migrations automatically on deployment if configured properly.

### Manual Migration (if needed):

1. **Go to your service**
2. **Click "Connect"**
3. **Use Railway CLI**:
   ```bash
   railway login
   railway link [your-project-id]
   railway run npm run migrate
   ```

## ✅ Post-Deployment Testing

### Test Checklist:
- [ ] Visit your Railway URL
- [ ] Check `/api/health` endpoint
- [ ] Test user registration
- [ ] Test user login
- [ ] Access admin panel (`/admin`)
- [ ] Test content management
- [ ] Verify database connectivity

### Default Admin Access:
- **URL**: `https://your-app.up.railway.app/admin`
- **Username**: `dr.priya`
- **Password**: `dietitian123`

## 💰 Railway Pricing

### Hobby Plan (Free):
- $5 credit monthly
- No credit card required
- Perfect for development/testing
- Shared resources

### Pro Plan ($20/month):
- $20 credit monthly
- Priority support
- Better performance
- Dedicated resources

### Usage-Based Pricing:
- Pay only for what you use
- Predictable costs
- No surprise bills

## 🔧 Troubleshooting

### Common Issues:

#### 1. **Build Failures**
```bash
# Check build logs in Railway dashboard
# Common solutions:
npm install --production=false
npm run build
```

#### 2. **Database Connection Issues**
```bash
# In Railway console, check:
echo $DATABASE_URL
# Should show PostgreSQL connection string
```

#### 3. **Environment Variables**
- Go to Service > Variables
- Verify all required variables are present
- Check for typos or extra spaces

#### 4. **Port Issues**
```javascript
// Railway automatically provides PORT
const PORT = process.env.PORT || 5000;
```

### Getting Help:

1. **Railway Logs**:
   - Go to Service Dashboard
   - Click "Logs" tab
   - Check deployment and runtime logs

2. **Railway CLI Debug**:
   ```bash
   railway logs --follow
   railway status
   ```

## 🌟 Railway Advantages

- ✅ Excellent developer experience
- ✅ Auto-detects most configurations
- ✅ Built-in PostgreSQL
- ✅ Usage-based pricing
- ✅ No cold starts
- ✅ Great logging and monitoring
- ✅ CLI tools
- ✅ GitHub integration

## ⚠️ Railway Considerations

- ❌ Newer platform (less mature ecosystem)
- ❌ Limited geographic regions
- ❌ Can be more expensive for high traffic
- ❌ Learning curve for some advanced features

---

## 🚀 Quick Deploy Command

If you have Railway CLI installed:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

## 📱 Mobile Access

Your app deployed on Railway is automatically:
- ✅ Mobile responsive
- ✅ PWA-enabled
- ✅ HTTPS secured
- ✅ Fast global CDN

Your NutriConnect app should now be live on Railway! 🎉