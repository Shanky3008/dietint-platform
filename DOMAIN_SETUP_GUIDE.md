# 🌐 Domain Setup Guide for NutriConnect Production

Complete guide for setting up a custom domain with Vercel deployment, SSL configuration, and DNS management.

## 📊 Domain Availability & Pricing Analysis

### 🔍 Checked Domains

| Domain | Extension | Estimated Price | Best For | Availability Check |
|--------|-----------|----------------|----------|-------------------|
| `nutriconnect.app` | .app | $15-20/year | Mobile-first branding | [Check Availability](https://www.whois.com/whois/nutriconnect.app) |
| `nutriwise.io` | .io | $31-47/year | Tech-savvy audience | [Check Availability](https://www.whois.com/whois/nutriwise.io) |
| `dietcraft.app` | .app | $15-20/year | Creative/craft appeal | [Check Availability](https://www.whois.com/whois/dietcraft.app) |

### 💰 Pricing Breakdown

#### .app Domains
- **Registration**: $15-20/year
- **Renewal**: $15-20/year
- **Transfer**: $15-20/year
- **Features**: Enforced HTTPS, Google Registry
- **Best Registrars**: Google Domains, Hostinger, GoDaddy

#### .io Domains  
- **Registration**: $31-47/year
- **Renewal**: $47-58/year
- **Transfer**: $47/year
- **Features**: Tech industry appeal, premium extension
- **Best Registrars**: Dynadot, Hostinger, Name.com

### ✅ Recommendation

**Primary Choice**: `nutriconnect.app`
- ✅ Perfect branding match
- ✅ Affordable pricing ($15-20/year)
- ✅ Enforced HTTPS security
- ✅ Mobile-first impression
- ✅ Google Registry reliability

**Alternative**: `dietcraft.app`
- ✅ Creative and memorable
- ✅ Same pricing and benefits as .app
- ✅ Unique positioning

## 🛒 Domain Purchase Instructions

### 1. Check Availability
```bash
# Using command line WHOIS
whois nutriconnect.app
whois dietcraft.app
whois nutriwise.io

# Or visit online checkers:
# - https://www.whois.com/whois/
# - https://domains.google/
# - https://www.godaddy.com/whois
```

### 2. Recommended Registrars

#### Option A: Google Domains (Recommended for .app)
1. Visit [domains.google.com](https://domains.google.com)
2. Search for `nutriconnect.app`
3. Add to cart ($15-20/year)
4. Complete purchase with Google account

#### Option B: Hostinger (Budget-friendly)
1. Visit [hostinger.com/tld/app-domain](https://www.hostinger.com/tld/app-domain)
2. Search for your domain
3. Price: ~$15.99/year for .app
4. Complete purchase

#### Option C: GoDaddy (Popular choice)
1. Visit [godaddy.com](https://www.godaddy.com)
2. Search for domain
3. Add domain privacy protection (+$8/year recommended)
4. Complete purchase

### 3. Domain Configuration Settings
```bash
# After purchase, configure these settings:
Domain Privacy: ENABLED (protects personal info)
Auto-renewal: ENABLED (prevents expiration)
DNS Management: ENABLED (for custom records)
Email Forwarding: OPTIONAL (forward @nutriconnect.app emails)
```

## 🔗 Connecting Domain to Vercel

### 1. Add Domain in Vercel Dashboard

#### Method A: Vercel Dashboard
```bash
# Steps:
1. Login to https://vercel.com/dashboard
2. Select your "nutriconnect-platform" project
3. Go to Settings → Domains
4. Click "Add Domain"
5. Enter: nutriconnect.app
6. Click "Add"
```

#### Method B: Vercel CLI
```bash
# Using command line
vercel domains add nutriconnect.app

# Link domain to project
vercel alias nutriconnect-platform.vercel.app nutriconnect.app
```

### 2. Configure DNS Records

Vercel will provide these DNS records to add at your registrar:

#### For Root Domain (nutriconnect.app)
```bash
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600
```

#### For WWW Subdomain (www.nutriconnect.app)
```bash
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 3. DNS Configuration by Registrar

#### Google Domains
```bash
1. Go to domains.google.com
2. Select your domain
3. Click "DNS" in left sidebar
4. Under "Custom records":
   - Add A record: @ → 76.76.19.61
   - Add CNAME record: www → cname.vercel-dns.com
5. Save changes
```

#### Hostinger
```bash
1. Login to Hostinger panel
2. Go to Domains → Manage
3. Click "DNS Zone"
4. Add records:
   - Type: A, Name: @, Points to: 76.76.19.61
   - Type: CNAME, Name: www, Points to: cname.vercel-dns.com
5. Save changes
```

#### GoDaddy
```bash
1. Login to GoDaddy account
2. Go to My Products → Domains
3. Click domain name → Manage DNS
4. Add records:
   - Type: A, Name: @, Value: 76.76.19.61
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
5. Save changes
```

### 4. Verification Commands
```bash
# Check DNS propagation
dig nutriconnect.app
dig www.nutriconnect.app

# Test domain resolution
nslookup nutriconnect.app
nslookup www.nutriconnect.app

# Check HTTP response
curl -I https://nutriconnect.app
curl -I https://www.nutriconnect.app
```

## 🔒 SSL Certificate Configuration

### 1. Automatic SSL (Vercel Handles This)
```bash
# Vercel automatically provides:
✅ Let's Encrypt SSL certificates
✅ Auto-renewal every 90 days
✅ HTTP to HTTPS redirects
✅ TLS 1.3 support
✅ Perfect Forward Secrecy
```

### 2. SSL Verification
```bash
# Check SSL certificate
curl -vI https://nutriconnect.app

# Test SSL rating
# Visit: https://www.ssllabs.com/ssltest/
# Enter: nutriconnect.app
# Expected rating: A or A+
```

### 3. Force HTTPS Configuration
Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://nutriconnect.app/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

### 4. Security Headers Update
Update `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 🌍 DNS Management Guide

### 1. Essential DNS Records

#### Primary Records
```bash
# Root domain
A     @              76.76.19.61        3600
AAAA  @              2606:4700::1111    3600

# WWW subdomain  
CNAME www            cname.vercel-dns.com  3600

# Vercel verification
TXT   @              "vercel=abc123..."     3600
```

#### Email Records (Optional)
```bash
# If using custom email (e.g., admin@nutriconnect.app)
MX    @              10 mx1.forwardemail.net     3600
MX    @              20 mx2.forwardemail.net     3600
TXT   @              "v=spf1 include:spf.forwardemail.net ~all"
```

#### Additional Subdomains
```bash
# API subdomain (if needed)
CNAME api            cname.vercel-dns.com  3600

# Admin panel subdomain (if needed)  
CNAME admin          cname.vercel-dns.com  3600

# Blog subdomain (if needed)
CNAME blog           cname.vercel-dns.com  3600
```

### 2. DNS Propagation Timeline
```bash
# Typical propagation times:
Local ISP:     5-10 minutes
Regional:      30-60 minutes  
Global:        2-48 hours
Max time:      72 hours (rare)

# Check propagation:
# https://dnschecker.org/
# https://whatsmydns.net/
```

### 3. DNS Monitoring
```bash
# Monitor DNS health
dig +trace nutriconnect.app
dig +short nutriconnect.app

# Check from multiple locations
nslookup nutriconnect.app 8.8.8.8
nslookup nutriconnect.app 1.1.1.1
```

## ⚡ Quick Setup Commands

### Complete Domain Setup Script
```bash
#!/bin/bash
# Quick domain setup script

DOMAIN="nutriconnect.app"
PROJECT="nutriconnect-platform"

echo "🌐 Setting up domain: $DOMAIN"

# Add domain to Vercel
vercel domains add $DOMAIN

# Link to project
vercel alias $PROJECT.vercel.app $DOMAIN

# Check DNS
echo "📡 Checking DNS..."
dig $DOMAIN

# Test SSL
echo "🔒 Testing SSL..."
curl -I https://$DOMAIN

echo "✅ Domain setup complete!"
echo "🔗 Visit: https://$DOMAIN"
```

### Verification Checklist
```bash
# Run this checklist after setup:
□ Domain purchased and configured
□ DNS records added at registrar
□ Domain added to Vercel project
□ DNS propagation complete (24-48h)
□ SSL certificate active
□ HTTPS redirect working
□ WWW redirect working
□ All pages loading correctly
□ No mixed content warnings
□ SEO meta tags updated with new domain
□ Social media links updated
□ Analytics tracking updated
```

## 🔧 Troubleshooting

### Common Issues

#### 1. DNS Not Propagating
```bash
# Solution 1: Clear local DNS cache
sudo systemctl flush-dns     # Linux
sudo dscacheutil -flushcache # macOS
ipconfig /flushdns           # Windows

# Solution 2: Check TTL values
dig nutriconnect.app | grep TTL

# Solution 3: Verify records at registrar
# Login to registrar and double-check DNS records
```

#### 2. SSL Certificate Not Working
```bash
# Check certificate status
openssl s_client -connect nutriconnect.app:443

# Force SSL renewal (if needed)
# Contact Vercel support - they handle SSL automatically
```

#### 3. Domain Not Connecting to Vercel
```bash
# Verify domain in Vercel
vercel domains ls

# Check project domains
vercel ls --scope=nutriconnect-platform

# Re-add domain if needed
vercel domains rm nutriconnect.app
vercel domains add nutriconnect.app
```

#### 4. Mixed Content Errors
```bash
# Update all HTTP links to HTTPS in:
- next.config.js
- API endpoints
- External resource links
- Image sources
- Font imports
```

## 📈 Post-Setup Optimization

### 1. Performance Testing
```bash
# Test site speed
# Visit: https://pagespeed.web.dev/
# Enter: https://nutriconnect.app

# Expected scores:
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

### 2. SEO Updates
```bash
# Update these files with new domain:
- public/sitemap.xml
- public/robots.txt
- app/layout.tsx (canonical URLs)
- social media meta tags
```

### 3. Analytics Configuration
```bash
# Update Google Analytics
- Change domain in GA4 property
- Update goals and conversions
- Test tracking on new domain

# Update other tools:
- Google Search Console
- Facebook Pixel
- Any other tracking tools
```

### 4. Monitoring Setup
```bash
# Set up uptime monitoring:
# - UptimeRobot (free)
# - Pingdom
# - StatusCake

# Monitor these endpoints:
- https://nutriconnect.app
- https://nutriconnect.app/api/health
- https://nutriconnect.app/auth/login
```

## 🎉 Success Confirmation

After completing setup, your NutriConnect platform will be available at:

- ✅ **Primary URL**: https://nutriconnect.app
- ✅ **WWW URL**: https://www.nutriconnect.app  
- ✅ **SSL Secured**: Grade A+ SSL rating
- ✅ **Auto HTTPS**: All HTTP traffic redirected
- ✅ **Global CDN**: Vercel's edge network
- ✅ **DNS Optimized**: Fast global resolution

Your professional dietitian platform now has a custom domain! 🚀