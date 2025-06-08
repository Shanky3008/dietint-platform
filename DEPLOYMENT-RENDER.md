# 🚀 Render.com Deployment Guide for NutriConnect

Render.com is an excellent alternative to Vercel, especially for full-stack applications. It provides both static site hosting and backend services in one platform.

## 📋 Prerequisites

- GitHub account with your NutriConnect code
- Render.com account (free at [render.com](https://render.com))

## 🏗️ Deployment Architecture

We'll deploy NutriConnect as two services on Render:
1. **Web Service** - Frontend (Next.js)
2. **PostgreSQL Database** - Database

## 🗄️ Step 1: Set Up Database

1. **Login to Render Dashboard**
2. **Click "New +"**
3. **Select "PostgreSQL"**
4. **Configure database**:
   - **Name**: `nutriconnect-db`
   - **Database**: `nutriconnect`
   - **User**: `nutriconnect_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (for testing) or Starter (for production)

5. **Click "Create Database"**
6. **Note down the connection details** (Internal Database URL)

## 🌐 Step 2: Deploy Web Service

### Frontend + Backend Combined Deployment

1. **Click "New +"**
2. **Select "Web Service"**
3. **Connect your GitHub repository**
4. **Configure service**:

```yaml
# Basic Settings
Name: nutriconnect-app
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

### Environment Variables

Add these in the Render dashboard:

```env
# Essential
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=NutriWise
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com

# Database (from Step 1)
DATABASE_URL=[Your Render PostgreSQL connection string]

# Security
JWT_SECRET=your-super-secure-random-string-min-32-characters

# CORS
ALLOWED_ORIGINS=https://your-app.onrender.com

# Payment (if needed)
UPI_ID=your-upi-id@paytm
PAYEE_NAME=Your Business Name
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_SECRET=your-secret
```

## 📁 Step 3: Configure Build Settings

Create `render.yaml` in your project root:

```yaml
databases:
  - name: nutriconnect-db
    databaseName: nutriconnect
    user: nutriconnect_user
    region: oregon

services:
  - type: web
    name: nutriconnect-app
    runtime: node
    plan: free  # or starter for production
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: nutriconnect-db
          property: connectionString
      - key: NEXT_PUBLIC_APP_URL
        value: https://nutriconnect-app.onrender.com
    autoDeploy: true
```

## 🔧 Step 4: Update Package.json

Update your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "node server-production.js",
    "migrate": "node scripts/migrate.js"
  }
}
```

## ✅ Step 5: Deploy

1. **Push your changes to GitHub**
2. **In Render dashboard, click "Create Web Service"**
3. **Connect your repository**
4. **Render will automatically deploy**

## 🔒 Step 6: Custom Domain (Optional)

1. **Go to your service settings**
2. **Click "Custom Domains"**
3. **Add your domain**
4. **Configure DNS with the provided CNAME**
5. **Update environment variables**:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
   ALLOWED_ORIGINS=https://your-custom-domain.com
   ```

## ✅ Post-Deployment Testing

- [ ] Visit your Render URL
- [ ] Test `/api/health` endpoint
- [ ] Test user registration/login
- [ ] Access admin panel
- [ ] Test content management

## 💰 Render Pricing

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- 750 hours/month (shared across all services)
- Basic PostgreSQL database

### Starter Plan ($7/month per service):
- No sleep/spin down
- Better performance
- More database storage

## 🔧 Troubleshooting

### Build Issues:
```bash
# Check build logs in Render dashboard
# Common fixes:
npm install --production=false
npm run build
```

### Database Connection:
```bash
# Test connection in Render shell
echo $DATABASE_URL
```

### Environment Variables:
- Go to Service Settings > Environment
- Verify all variables are set correctly

---

## 🌟 Render Advantages

- ✅ Simple deployment process
- ✅ Built-in PostgreSQL hosting
- ✅ Automatic SSL certificates
- ✅ Git-based deployments
- ✅ Good free tier for testing
- ✅ Easy custom domains

## ⚠️ Render Considerations

- ❌ Free tier has cold starts (15-minute sleep)
- ❌ Limited geographic regions
- ❌ No edge computing
- ❌ Smaller ecosystem than Vercel