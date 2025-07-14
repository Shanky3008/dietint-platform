# 🚀 DietInt Vercel Deployment Setup

## Step 1: Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub account: **shankar.aca@gmail.com**
3. Connect your GitHub account when prompted

## Step 2: Deploy from GitHub
1. In Vercel dashboard, click **"New Project"**
2. Import from GitHub: **Shanky3008/dietint-platform**
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` 
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

## Step 3: Environment Variables
Add these in Vercel Project Settings → Environment Variables:

### 🔴 CRITICAL (Required for basic functionality):
```
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=DietInt
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
JWT_SECRET=your-secure-32-character-random-string-here
DATABASE_URL=postgresql://username:password@host:port/database
ALLOWED_ORIGINS=https://your-project-name.vercel.app
```

### 🟡 IMPORTANT (For full functionality):
```
NEXT_PUBLIC_CONTACT_EMAIL=hello@dietint.com
NEXT_PUBLIC_CONTACT_PHONE=+1 (555) 123-DIET
NEXT_PUBLIC_BRAND_NAME=DietInt
NEXT_PUBLIC_BRAND_TAGLINE=Diet Intelligence • Diet Interaction
```

### 🟢 OPTIONAL (For enhanced features):
```
UPI_ID=your-upi-id@paytm
PAYEE_NAME=Your Business Name
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_SECRET=your_razorpay_secret
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@dietint.com
```

## Step 4: Database Setup

### Option A: Vercel Postgres (Easiest)
1. In Vercel dashboard → **Storage** → **Create Database**
2. Select **Postgres** → Choose region → **Create**
3. Copy connection string to `DATABASE_URL` environment variable

### Option B: Supabase (Free)
1. Go to [https://supabase.com](https://supabase.com) → **New Project**
2. **Settings** → **Database** → Copy connection string
3. Add to `DATABASE_URL` environment variable

## Step 5: Deploy
1. Click **"Deploy"** in Vercel
2. Wait for build to complete (~3-5 minutes)
3. Get your live URL: `https://dietint-platform.vercel.app`

## Step 6: Test Your Deployment
1. **Homepage**: Visit your live URL
2. **Admin Panel**: Go to `/admin`
   - Username: `dr.priya`
   - Password: `dietitian123`
3. **API Health**: Visit `/api/health`
4. **Mobile**: Test on mobile device - install as PWA

## 🎉 Expected Results:
✅ **Live DietInt Platform**: Professional nutrition platform
✅ **Mobile PWA**: Installable on all devices  
✅ **Admin Dashboard**: Full content management
✅ **Professional Branding**: Complete DietInt identity
✅ **SSL Security**: Automatic HTTPS
✅ **Auto Deployment**: Updates on every GitHub push

## 🆘 Troubleshooting:
- **500 Error**: Check environment variables are set
- **Build Failed**: Verify all dependencies in package.json
- **Database Issues**: Ensure DATABASE_URL is correct
- **CORS Errors**: Add your domain to ALLOWED_ORIGINS

## 📱 Mobile Access:
Once deployed, users can:
- Visit the URL on mobile
- Add to home screen (PWA)
- Use offline functionality
- Install as native app experience

Your DietInt platform will be production-ready! 🚀