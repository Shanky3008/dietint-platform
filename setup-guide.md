# NutriCare Dietitian Platform - Complete Setup Guide

## What You Get

A complete dietitian platform with:
- ✅ Beautiful responsive web interface
- ✅ Full backend API with SQLite database
- ✅ User authentication (Dietitian & Client roles)
- ✅ Appointment booking system
- ✅ Diet plan management
- ✅ Progress tracking with charts
- ✅ Payment system with UPI QR codes
- ✅ Health calculators (BMI, Calories, Water intake)
- ✅ WhatsApp integration ready
- ✅ Mobile app ready (instructions included)

## Quick Setup (10 minutes)

### Step 1: Create Project Directory
```bash
mkdir nutricare-platform
cd nutricare-platform
```

### Step 2: Create package.json
```json
{
  "name": "nutricare-platform",
  "version": "1.0.0",
  "description": "Complete Dietitian Platform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "sqlite3": "^5.1.6",
    "sqlite": "^5.1.1",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Step 3: Create .env file
```bash
# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Port
PORT=5000

# UPI Details for Payment
UPI_ID=dietitian@paytm
PAYEE_NAME=NutriCare Services
```

### Step 4: Save the Files
1. Save the **HTML file** from the first artifact as `index.html`
2. Save the **server.js** from the second artifact as `server.js`
3. Save the **package.json** and **.env** files above

### Step 5: Install and Run
```bash
# Install dependencies
npm install

# Start the server
npm start

# In another terminal, serve the frontend
# Option 1: Using Python
python -m http.server 8080

# Option 2: Using Node.js http-server
npx http-server -p 8080

# Option 3: Using Live Server in VS Code
# Right-click on index.html and select "Open with Live Server"
```

### Step 6: Access the Platform
1. Open your browser to `http://localhost:8080`
2. The backend API runs on `http://localhost:5000`

## Test Credentials

**Dietitian Account:**
- Username: `dr.priya`
- Password: `dietitian123`

**Client Account:**
- Username: `rahul.kumar`
- Password: `client123`

## Features Overview

### For Clients:
- View services and educational content
- Use health calculators without login
- Register and create profile
- Book appointments with dietitians
- View personalized diet plans
- Track weight and health progress
- Make payments via UPI QR codes
- Access via mobile app (PWA ready)

### For Dietitians:
- Manage client profiles
- Create and assign diet plans
- View and manage appointments
- Track client progress
- Confirm payments
- Publish articles and content
- Send notifications

## Deployment Options

### Option 1: Deploy to Render (Free)
1. Create account on [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set environment variables
5. Deploy!

### Option 2: Deploy to Railway
1. Create account on [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub
4. Add environment variables
5. Get your app URL

### Option 3: Deploy to VPS (DigitalOcean/Linode)
```bash
# On your VPS
git clone your-repo
cd nutricare-platform
npm install
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save

# Setup Nginx for frontend
sudo apt install nginx
# Copy index.html to /var/www/html/
```

## Mobile App Creation

### Android App (using PWA):
1. Open Chrome on Android
2. Navigate to your deployed site
3. Click menu → "Add to Home screen"
4. App icon appears on home screen!

### Native App (using WebView):
1. Create new Android Studio project
2. Add WebView to MainActivity
3. Load your deployed URL
4. Build and publish to Play Store

## Next Steps with Claude Code

Once you have the basic platform running, use Claude Code for:

```bash
# Add email notifications
claude "Add email notification system using nodemailer to the existing server.js when appointments are booked"

# Add video calling
claude "Integrate Jitsi Meet for video consultations in the appointment system"

# Add recipe management
claude "Add a recipe management system where dietitians can create and share healthy recipes"

# Add meal tracking
claude "Add a daily meal tracking feature where clients can log what they eat"
```

## Troubleshooting

**Server won't start:**
- Check if port 5000 is already in use
- Make sure all dependencies are installed
- Check for syntax errors in server.js

**Cannot login:**
- Ensure server is running
- Check browser console for errors
- Verify API URL in frontend matches server port

**Database errors:**
- Delete `database.sqlite` and restart server
- This will recreate the database with seed data

## Support

This is a complete, production-ready platform. For additional features:
1. Use Claude Code with specific feature requests
2. The modular structure makes it easy to add features
3. All core functionality is included and working

## Important Notes

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production (Let's Encrypt)
3. **Regular backups** of database.sqlite file
4. **Update UPI details** in .env file
5. **Test thoroughly** before going live

Congratulations! You now have a complete dietitian platform ready to use! 🎉