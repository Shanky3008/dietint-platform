# 🚀 Netlify + Supabase Deployment Guide for NutriConnect

This guide shows how to deploy NutriConnect using Netlify for the frontend and Supabase for the database - a powerful serverless combination.

## 📋 Prerequisites

- GitHub account with your NutriConnect code
- Netlify account (free at [netlify.com](https://netlify.com))
- Supabase account (free at [supabase.com](https://supabase.com))

## 🗄️ Step 1: Set Up Supabase Database

### Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login**
3. **Click "New Project"**
4. **Configure project**:
   - **Organization**: Your organization
   - **Name**: `nutriconnect`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (for development)

5. **Click "Create new project"**
6. **Wait for setup to complete** (~2 minutes)

### Configure Database Schema

1. **Go to SQL Editor in Supabase**
2. **Run the database migrations**:
   - Copy content from `migrations/001_create_tables.sql`
   - Paste and execute in SQL Editor
   - Copy content from `migrations/002_seed_content.sql`
   - Paste and execute in SQL Editor

3. **Note your connection details**:
   - Go to Settings > Database
   - Copy the "Connection string" and "Connection pooling" URL

## 🌐 Step 2: Prepare for Netlify

### Update Configuration for Serverless

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
```

### Convert API Routes to Netlify Functions

Create `netlify/functions/` directory and move your API logic:

```javascript
// netlify/functions/content.js
const { getDatabaseAdapter } = require('../../lib/database');

exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;
  
  try {
    // Handle CORS
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
        },
        body: ''
      };
    }

    const db = await getDatabaseAdapter();
    
    // Your API logic here
    // ... (content management logic)
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true, data: result })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

## 🔧 Step 3: Update Database Configuration

Update `lib/database.js` for Supabase:

```javascript
// lib/database.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Use service key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseAdapter {
  constructor(client) {
    this.client = client;
    this.type = 'supabase';
  }

  async query(table, options = {}) {
    let query = this.client.from(table);
    
    if (options.select) query = query.select(options.select);
    if (options.where) query = query.eq(options.where.column, options.where.value);
    if (options.limit) query = query.limit(options.limit);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async insert(table, data) {
    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  }

  async update(table, data, where) {
    const { data: result, error } = await this.client
      .from(table)
      .update(data)
      .eq(where.column, where.value)
      .select();
    
    if (error) throw error;
    return result;
  }

  async delete(table, where) {
    const { error } = await this.client
      .from(table)
      .delete()
      .eq(where.column, where.value);
    
    if (error) throw error;
    return true;
  }
}

async function getDatabaseAdapter(useAdmin = false) {
  const client = useAdmin ? supabaseAdmin : supabase;
  return new SupabaseAdapter(client);
}

module.exports = { getDatabaseAdapter, supabase, supabaseAdmin };
```

## 🚀 Step 4: Deploy to Netlify

### Method 1: Netlify Dashboard

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login**
3. **Click "New site from Git"**
4. **Connect GitHub**
5. **Select your NutriConnect repository**
6. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: `netlify/functions`

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# For production deployment
netlify deploy --prod
```

## 🔒 Step 5: Configure Environment Variables

In Netlify dashboard, go to Site Settings > Environment Variables:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=NutriWise
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app

# Supabase (from your Supabase dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Security
JWT_SECRET=your-super-secure-random-string

# CORS
ALLOWED_ORIGINS=https://your-app.netlify.app

# Payment (optional)
UPI_ID=your-upi-id@paytm
PAYEE_NAME=Your Business Name
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_SECRET=your-secret
```

## 🔐 Step 6: Configure Supabase Auth (Optional)

If using Supabase Auth instead of custom JWT:

1. **Go to Authentication > Settings in Supabase**
2. **Add your site URL**: `https://your-app.netlify.app`
3. **Configure redirect URLs**
4. **Update auth configuration in your app**

## 🌐 Step 7: Custom Domain (Optional)

### In Netlify:
1. **Go to Site Settings > Domain management**
2. **Click "Add custom domain"**
3. **Add your domain**
4. **Configure DNS**

### Update Environment Variables:
```env
NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
ALLOWED_ORIGINS=https://your-custom-domain.com
```

## ✅ Step 8: Post-Deployment Testing

### Test Checklist:
- [ ] Visit your Netlify URL
- [ ] Test serverless functions: `/.netlify/functions/content`
- [ ] Test user registration/login
- [ ] Access admin panel
- [ ] Test content management
- [ ] Verify Supabase integration

## 🔧 Troubleshooting

### Common Issues:

#### 1. **Function Timeouts**
```toml
# In netlify.toml
[functions]
  timeout = 30
  node_bundler = "esbuild"
```

#### 2. **CORS Issues**
```javascript
// Add CORS headers to all functions
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
}
```

#### 3. **Build Issues**
```bash
# Check build logs in Netlify dashboard
# Common fixes:
npm install
npm run build
```

#### 4. **Database Connection**
```javascript
// Test Supabase connection
const { data, error } = await supabase
  .from('content')
  .select('*')
  .limit(1);
```

## 💰 Pricing Comparison

### Netlify Free Tier:
- 100GB bandwidth/month
- 300 build minutes/month
- 125,000 serverless function invocations

### Supabase Free Tier:
- 2 projects
- 500MB database storage
- 2GB bandwidth
- 50,000 monthly active users

### Paid Plans:
- **Netlify Pro**: $19/month
- **Supabase Pro**: $25/month

## 🌟 Netlify + Supabase Advantages

- ✅ Excellent free tiers
- ✅ Serverless architecture
- ✅ Built-in authentication (Supabase)
- ✅ Real-time capabilities (Supabase)
- ✅ Edge computing (Netlify)
- ✅ Great developer experience
- ✅ Automatic SSL
- ✅ Git-based deployments

## ⚠️ Considerations

- ❌ More complex setup
- ❌ Function cold starts
- ❌ Need to manage two platforms
- ❌ API routes need conversion to functions

---

Your NutriConnect app is now deployed using a modern serverless stack! 🎉

### Key URLs:
- **Frontend**: `https://your-app.netlify.app`
- **Admin Panel**: `https://your-app.netlify.app/admin`
- **Database**: Supabase Dashboard
- **Functions**: `https://your-app.netlify.app/.netlify/functions/`