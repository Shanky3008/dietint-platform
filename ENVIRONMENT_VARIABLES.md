# NutriConnect Environment Variables for Production

This document lists all environment variables required for deploying NutriConnect to Vercel.

## 🔐 Required Environment Variables

### Database Configuration
```bash
# Vercel Postgres Database
DATABASE_URL="postgresql://username:password@hostname:5432/nutriconnect"
POSTGRES_URL="postgresql://username:password@hostname:5432/nutriconnect"
POSTGRES_PRISMA_URL="postgresql://username:password@hostname:5432/nutriconnect?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://username:password@hostname:5432/nutriconnect"

# Database Pool Settings
POSTGRES_USER="your_postgres_user"
POSTGRES_HOST="your_postgres_host"
POSTGRES_PASSWORD="your_postgres_password"
POSTGRES_DATABASE="nutriconnect"
```

### Application Configuration
```bash
# Environment
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://nutriconnect.vercel.app"
NEXT_PUBLIC_API_URL="https://nutriconnect.vercel.app/api"

# Security
NEXTAUTH_SECRET="your-super-secret-jwt-secret-key-here"
NEXTAUTH_URL="https://nutriconnect.vercel.app"
JWT_SECRET="your-jwt-secret-for-tokens"
ENCRYPTION_KEY="your-32-character-encryption-key"
CSRF_SECRET="your-csrf-protection-secret"

# Session Management
SESSION_SECRET="your-session-secret-key"
COOKIE_SECRET="your-cookie-encryption-secret"
```

### Email Configuration
```bash
# SMTP Settings (using SendGrid/Mailgun/etc.)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
FROM_EMAIL="noreply@nutriconnect.com"
SUPPORT_EMAIL="support@nutriconnect.com"

# Email Service API Keys
SENDGRID_API_KEY="your-sendgrid-api-key"
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-mailgun-domain"
```

### Payment Processing
```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_ENDPOINT_SECRET="whsec_your_endpoint_secret"

# PayPal Configuration (if using)
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="live"
```

### File Storage
```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
NEXT_PUBLIC_BLOB_URL="https://your-blob-storage.vercel-storage.com"

# AWS S3 (alternative)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="nutriconnect-uploads"
```

### External APIs
```bash
# Google APIs (for maps, auth, etc.)
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# OpenAI (for AI features)
OPENAI_API_KEY="your-openai-api-key"
OPENAI_ORG_ID="your-openai-organization-id"

# Nutrition API
SPOONACULAR_API_KEY="your-spoonacular-api-key"
EDAMAM_APP_ID="your-edamam-app-id"
EDAMAM_APP_KEY="your-edamam-app-key"
```

### Monitoring and Analytics
```bash
# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-vercel-analytics-id"

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
GA_TRACKING_ID="GA-XXXXXXXXX"

# Sentry Error Tracking
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="nutriconnect"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# LogRocket Session Replay
LOGROCKET_APP_ID="your-logrocket-app-id"
```

### Communication Services
```bash
# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
WHATSAPP_NUMBER="+1234567890"

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"
```

### Rate Limiting and Security
```bash
# Redis (for rate limiting) - Upstash Redis
REDIS_URL="redis://your-redis-url:6379"
UPSTASH_REDIS_REST_URL="https://your-redis-rest-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-rest-token"

# Cloudflare (if using)
CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
CLOUDFLARE_ZONE_ID="your-cloudflare-zone-id"
```

### Video Calling
```bash
# Agora.io (Video calls)
AGORA_APP_ID="your-agora-app-id"
AGORA_APP_CERTIFICATE="your-agora-app-certificate"

# Zoom SDK (alternative)
ZOOM_API_KEY="your-zoom-api-key"
ZOOM_API_SECRET="your-zoom-api-secret"
```

### Content Management
```bash
# CMS (if using headless CMS)
CONTENTFUL_SPACE_ID="your-contentful-space-id"
CONTENTFUL_ACCESS_TOKEN="your-contentful-access-token"
CONTENTFUL_PREVIEW_ACCESS_TOKEN="your-contentful-preview-token"

# Sanity CMS (alternative)
SANITY_PROJECT_ID="your-sanity-project-id"
SANITY_DATASET="production"
SANITY_API_TOKEN="your-sanity-api-token"
```

### Backup and Storage
```bash
# Backup Service
BACKUP_SERVICE_URL="https://your-backup-service.com"
BACKUP_API_KEY="your-backup-api-key"
BACKUP_BUCKET="nutriconnect-backups"
```

## 🎯 Environment-Specific Variables

### Production Only
```bash
# Production optimizations
NEXT_TELEMETRY_DISABLED="1"
ANALYZE="false"
BUNDLE_ANALYZE="false"

# Production URLs
NEXT_PUBLIC_SITE_URL="https://nutriconnect.com"
NEXT_PUBLIC_CDN_URL="https://cdn.nutriconnect.com"
```

### Development (for reference)
```bash
# Development URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Development Database
DATABASE_URL="file:./nutriconnect.sqlite"

# Development SMTP (Ethereal/Mailtrap)
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_USER="your-ethereal-username"
SMTP_PASSWORD="your-ethereal-password"
```

## 🔧 Vercel-Specific Variables

### Automatic Vercel Variables (No setup needed)
```bash
# These are automatically provided by Vercel
VERCEL="1"
VERCEL_ENV="production"
VERCEL_URL="nutriconnect.vercel.app"
VERCEL_REGION="iad1"
VERCEL_GIT_COMMIT_SHA="abc123"
VERCEL_GIT_COMMIT_MESSAGE="Deploy to production"
VERCEL_GIT_COMMIT_AUTHOR_NAME="Developer Name"
VERCEL_GIT_PROVIDER="github"
VERCEL_GIT_REPO_OWNER="your-username"
VERCEL_GIT_REPO_SLUG="nutriconnect"
```

## 📝 Setting Environment Variables in Vercel

### Via Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate scope:
   - **Production**: Live environment
   - **Preview**: Pull request deployments
   - **Development**: Local development

### Via Vercel CLI
```bash
# Set individual variables
vercel env add DATABASE_URL production
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXTAUTH_SECRET production

# Import from .env file
vercel env pull .env.production
```

### Via .env.production.local (for deployment)
```bash
# Create .env.production.local file
touch .env.production.local

# Add all production variables
echo 'DATABASE_URL="your-postgres-url"' >> .env.production.local
echo 'NEXTAUTH_SECRET="your-secret"' >> .env.production.local
# ... add all other variables
```

## 🔒 Security Best Practices

### Secret Generation
```bash
# Generate secure secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -hex 32     # For JWT_SECRET
openssl rand -base64 24  # For CSRF_SECRET
```

### Variable Validation
```javascript
// Add to your app for runtime validation
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'STRIPE_SECRET_KEY',
  'SMTP_PASSWORD'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## 📊 Environment Variable Checklist

### Pre-Deployment Checklist
- [ ] All database credentials configured
- [ ] Authentication secrets generated and set
- [ ] Payment processor keys (Stripe) configured
- [ ] Email service credentials set
- [ ] File storage tokens configured
- [ ] External API keys added
- [ ] Monitoring service tokens set
- [ ] Security headers and secrets configured
- [ ] Production URLs updated
- [ ] All secrets are unique and secure

### Post-Deployment Verification
- [ ] Database connection working
- [ ] Authentication flows functional
- [ ] Payment processing operational
- [ ] Email delivery working
- [ ] File uploads successful
- [ ] External API calls working
- [ ] Monitoring data flowing
- [ ] Error tracking active

## 🚨 Common Issues and Solutions

### Database Connection Issues
```bash
# Ensure connection string format is correct
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# For Vercel Postgres, use provided connection strings
POSTGRES_PRISMA_URL="..." # For Prisma with connection pooling
POSTGRES_URL_NON_POOLING="..." # For direct connections
```

### CORS Issues
```bash
# Ensure NEXT_PUBLIC_APP_URL matches your domain
NEXT_PUBLIC_APP_URL="https://nutriconnect.vercel.app"
# Update vercel.json CORS headers accordingly
```

### Build Issues
```bash
# Ensure all TypeScript environment variables are declared
# Create next-env.d.ts with proper types
```

---

**Last Updated**: December 8, 2024  
**Production Ready**: All variables configured  
**Security Level**: Enterprise-grade encryption