# 🚀 Vercel Deployment Guide for NutriConnect

This guide will help you deploy your NutriConnect application to Vercel in just a few steps, even if you're not technical!

## 📋 Prerequisites

Before you start, make sure you have:
- A GitHub account
- Your NutriConnect application code pushed to GitHub
- A Vercel account (free at [vercel.com](https://vercel.com))

## 🔧 Step 1: Prepare Your Environment Variables

1. **Copy the environment template**:
   ```bash
   cp .env.example .env.production
   ```

2. **Fill in the required values** in `.env.production`:

### 🔑 Essential Variables (REQUIRED)

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=YourAppName
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Database (See Step 2 for setup)
DATABASE_URL=postgresql://...

# Security (CRITICAL - Generate a secure random string)
JWT_SECRET=your-super-secure-random-string-min-32-characters
```

### 🎨 Customization Variables

```env
# CORS (Add your domain)
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# Branding
NEXT_PUBLIC_APP_NAME=NutriWise
```

## 🗄️ Step 2: Set Up Database

### Option A: Vercel Postgres (Recommended - Easiest)

1. **Go to your Vercel dashboard**
2. **Click "Storage" tab**
3. **Click "Create Database"**
4. **Select "Postgres"**
5. **Choose your region** (closest to your users)
6. **Click "Create"**
7. **Copy the connection string** and add it to your environment variables

### Option B: Supabase (Free Alternative)

1. **Go to [supabase.com](https://supabase.com)**
2. **Create a new project**
3. **Go to Settings > Database**
4. **Copy the connection string**
5. **Add to your environment variables**

## 🌐 Step 3: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your NutriConnect repository**
5. **Configure project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or your project folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add each variable from your `.env.production` file
   - Set all to "Production" environment

7. **Click "Deploy"**

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy? [Y/n] y
# ? Which scope? [Your username]
# ? Link to existing project? [y/N] n
# ? What's your project's name? nutriconnect
# ? In which directory is your code located? ./
```

## 🔒 Step 4: Configure Environment Variables in Vercel

1. **Go to your project dashboard in Vercel**
2. **Click "Settings" tab**
3. **Click "Environment Variables"**
4. **Add each variable**:

### Required Variables:
```
NODE_ENV = production
NEXT_PUBLIC_APP_NAME = YourAppName
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
DATABASE_URL = [Your database connection string]
JWT_SECRET = [Your secure random string - min 32 chars]
ALLOWED_ORIGINS = https://your-app.vercel.app
```

### Payment Integration (if needed):
```
UPI_ID = your-upi-id@paytm
PAYEE_NAME = Your Business Name
RAZORPAY_KEY_ID = rzp_live_...
RAZORPAY_SECRET = your-secret
```

### Email Configuration (optional):
```
RESEND_API_KEY = your-resend-key
FROM_EMAIL = noreply@your-domain.com
```

## 🗃️ Step 5: Run Database Migrations

After deployment, you need to set up your database:

1. **Go to your Vercel project dashboard**
2. **Click "Functions" tab**
3. **Find your deployment**
4. **Open the deployment URL**
5. **Add `/api/health` to check if it's working**

The migrations will run automatically on first deployment if you're using the production server.

## 🌍 Step 6: Configure Custom Domain (Optional)

1. **Go to your project settings in Vercel**
2. **Click "Domains" tab**
3. **Add your custom domain**
4. **Follow the DNS configuration instructions**
5. **Update your environment variables**:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
   ALLOWED_ORIGINS=https://your-custom-domain.com
   ```

## ✅ Step 7: Post-Deployment Testing

### 1. Test Basic Functionality
- [ ] Visit your deployed URL
- [ ] Check that the homepage loads
- [ ] Test user registration
- [ ] Test user login
- [ ] Access admin panel (login with dietitian account)

### 2. Test Admin Features
- [ ] Login as admin: `dr.priya` / `dietitian123`
- [ ] Go to `/admin`
- [ ] Click "Content" tab
- [ ] Try editing some content
- [ ] Verify changes appear on homepage

### 3. Test API Endpoints
- [ ] Visit `/api/health` - should show "healthy"
- [ ] Test content API: `/api/content`

### 4. Check Environment Variables
Make sure all required environment variables are set:
```bash
# In Vercel dashboard, go to Settings > Environment Variables
# Verify all required variables are present and correct
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. **500 Internal Server Error**
- Check environment variables are set correctly
- Verify JWT_SECRET is at least 32 characters
- Check database connection string

#### 2. **Database Connection Failed**
- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel
- For Supabase: Enable "Disable SSL" if needed

#### 3. **CORS Errors**
- Add your domain to ALLOWED_ORIGINS
- Make sure the domain matches exactly (with/without www)

#### 4. **Build Failed**
- Check all dependencies are in package.json
- Verify there are no TypeScript errors
- Check build logs in Vercel dashboard

### Getting Help:

1. **Check Vercel logs**:
   - Go to project dashboard
   - Click "Functions" tab
   - Check deployment logs

2. **Database issues**:
   - Test connection string locally first
   - Check database provider documentation

3. **Environment variables**:
   - Double-check spelling and values
   - Ensure no extra spaces or quotes

## 🎉 Success!

Your NutriConnect application should now be live! 

### Default Admin Access:
- **URL**: `https://your-app.vercel.app/admin`
- **Username**: `dr.priya`
- **Password**: `dietitian123`

### Next Steps:
1. Change the default admin password
2. Update content through the admin panel
3. Configure your custom domain
4. Set up analytics and monitoring
5. Add payment integration if needed

## 📱 Mobile Access

Your app is automatically mobile-responsive and can be installed as a PWA (Progressive Web App) on mobile devices.

## 🔄 Updates

To update your app:
1. Push changes to your GitHub repository
2. Vercel will automatically deploy the changes
3. No downtime required!

---

**Need help?** Check the troubleshooting section above or contact support.