# 🧠💬 DietInt by Gouri Priya Mylavarapu

> **Professional Nutrition Platform with AT-HOME Foods Approach**  
> *Transforming Lives Through Sustainable Nutrition & Traditional Wisdom*

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-blue)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.0-007FFF)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 👩‍⚕️ About the Platform

**DietInt** is a comprehensive nutrition and wellness platform created by **Gouri Priya Mylavarapu**, MSc Nutrition, with 11+ years of experience transforming lives through sustainable dietary practices. The platform embodies her proven **AT-HOME foods approach** - using everyday kitchen ingredients rather than expensive supplements or special diet products.

### 🎯 **Our Mission**
*"A lifestyle change is the key to lead a healthy life and your health coach (nutritionist) is the one who will guide you to reach the light of that tunnel."* - Gouri Priya Mylavarapu

## 🏠 **The AT-HOME Foods Approach**

Our signature methodology focuses on:

- **🍽️ Everyday Ingredients**: No special diet products required - use what's already in your kitchen
- **🔬 Research-Based Concepts**: Scientific backing combined with traditional wisdom
- **📊 Day-to-Day Monitoring**: Continuous support with real-time adjustments
- **👂 Body Signal Awareness**: Teaching your body to follow its natural signals for healthy weight management
- **🌿 Sustainable Lifestyle**: Long-term changes over quick fixes
- **🏛️ Cultural Integration**: Healthy adaptations of traditional Telugu and Indian cuisine

## ✨ **Key Features**

### 🔐 **User Management**
- Secure authentication with NextAuth
- Role-based access (Client, Dietitian, Admin)
- Comprehensive user profiles
- Progress tracking and analytics

### 📝 **Content Management**
- Professional nutrition articles and recipes
- Traditional cuisine adaptations
- Seasonal eating guides
- Expert tips and research insights

### 💼 **Professional Services**
- **Individual Consultations**: 1-hour personalized sessions
- **Corporate Wellness**: Group programs and speaking engagements
- **Media Consultation**: Content creation based on 11+ years TV experience
- **Hospital Partnerships**: Clinical nutrition support
- **Traditional Cuisine Adaptation**: Regional food customization

### 📱 **Modern Features**
- Progressive Web App (PWA) capabilities
- Mobile-responsive design
- Real-time notifications
- Payment processing integration
- Email and WhatsApp communication

### 📊 **Analytics & Tracking**
- Client progress monitoring
- Nutrition goal tracking
- Success metrics dashboard
- Performance analytics

## 🛠️ **Tech Stack**

### **Frontend**
- **Framework**: [Next.js 15.3.3](https://nextjs.org/) - React framework with SSR/SSG
- **Language**: [TypeScript 5.6.0](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Library**: [Material-UI 5.15.0](https://mui.com/) - React component library
- **State Management**: [Redux Toolkit 2.2.0](https://redux-toolkit.js.org/) - Predictable state container
- **Styling**: [Emotion](https://emotion.sh/) - CSS-in-JS library
- **Forms**: [React Hook Form 7.53.0](https://react-hook-form.com/) - Performant forms

### **Backend & APIs**
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime
- **API Routes**: Next.js API routes for serverless functions
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) - Authentication library
- **Database**: [SQLite 5.1.7](https://www.sqlite.org/) - Lightweight database
- **Validation**: [Zod 3.25.51](https://zod.dev/) - TypeScript-first schema validation

### **Additional Libraries**
- **HTTP Client**: [Axios 1.6.0](https://axios-http.com/) - Promise-based HTTP client
- **Date Handling**: Native JavaScript Date API
- **Charts**: [Recharts 2.15.3](https://recharts.org/) - Composable charting library
- **PDF Generation**: [PDF-lib 1.17.1](https://pdf-lib.js.org/) - PDF manipulation
- **QR Codes**: [QRCode 1.5.4](https://github.com/soldair/node-qrcode) - QR code generation
- **Email**: [Nodemailer 7.0.3](https://nodemailer.com/) - Email sending
- **Security**: [Helmet 8.1.0](https://helmetjs.github.io/) - Security headers

### **Development Tools**
- **Package Manager**: [npm](https://www.npmjs.com/)
- **Linting**: [ESLint 8.57.0](https://eslint.org/) - Code linting
- **Build Tool**: [Next.js built-in build system](https://nextjs.org/docs/api-reference/cli#build)

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18.0+ installed
- npm or yarn package manager
- Git for version control

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/nutriconnect-platform.git
cd nutriconnect-platform

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local

# Set up the database
npm run setup:db

# Start development server
npm run dev
```

### **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Application
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL=./database.sqlite

# Authentication
JWT_SECRET=your-jwt-secret-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@dietint.com
EMAIL_PASS=your-app-password

# WhatsApp Integration (Optional)
WHATSAPP_API_KEY=your-whatsapp-api-key

# Admin Configuration
ADMIN_EMAIL=gouri@dietint.com
ADMIN_PASSWORD=secure-admin-password

# Payment Integration (Production)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server on http://localhost:3002

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run setup:db     # Initialize database with sample data
npm run migrate      # Run database migrations
npm run seed         # Seed database with content

# Testing
npm run test         # Run test suite (when implemented)
```

## 📁 **Project Structure**

```
nutriconnect-platform/
├── app/                          # Next.js 13+ App Router
│   ├── about/                    # About page with Gouri Priya's bio
│   ├── admin/                    # Admin dashboard
│   ├── articles/                 # Blog articles & recipes
│   │   ├── virgin-coconut-oil-benefits/
│   │   ├── understanding-milk-diet/
│   │   ├── summer-soaked-poha-recipe/
│   │   └── amla-chutney-vitamin-c-powerhouse/
│   ├── auth/                     # Authentication pages
│   ├── contact/                  # Contact information
│   ├── dashboard/                # User dashboard
│   ├── faq/                      # FAQ page
│   └── payments/                 # Payment processing
├── components/                   # Reusable React components
│   ├── ui/                       # UI components
│   ├── DietPlanSection.tsx
│   ├── FeaturesSection.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── Navbar.tsx
│   ├── ServicesSection.tsx
│   └── TestimonialsSection.tsx
├── lib/                          # Utility libraries
│   ├── api/                      # API client functions
│   ├── auth/                     # Authentication logic
│   ├── backup/                   # Backup utilities
│   ├── email/                    # Email services
│   ├── features/                 # Feature-specific logic
│   ├── pdf/                      # PDF generation
│   ├── performance/              # Performance monitoring
│   ├── security/                 # Security utilities
│   └── whatsapp/                 # WhatsApp integration
├── migrations/                   # Database migrations
├── pages/api/                    # API routes
├── public/                       # Static assets
│   ├── icons/                    # PWA icons
│   ├── screenshots/              # PWA screenshots
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker
├── scripts/                      # Utility scripts
├── uploads/                      # File uploads
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── vercel.json                   # Vercel deployment config
```

## 👩‍⚕️ **About Gouri Priya Mylavarapu**

**MSc Nutrition | 11+ Years Experience | EtvLife Nutritionist**

Gouri Priya Mylavarapu is an experienced nutrition professional with more than 11 years of experience transforming the lifestyle of numerous individuals. Having been associated with multiple hospitals, fitness centers, and successful healthcare technology startups, she has successfully built healthy proprietary diet plans customized based on individual challenges.

### **Professional Background**
- **Education**: MSc Nutrition from Shadan Institute of P.G. Studies
- **Experience**: 11+ years in clinical and community nutrition
- **Media Presence**: Regular columnist and Telugu TV show host
- **Corporate Expertise**: Wellness programs and speaking engagements
- **Specializations**: Weight management, PCOS, diabetes, traditional cuisine adaptation

### **Philosophy**
*"I will eventually become your guide, who will constantly motivate and let you be the driver of your car and reach your destination."*

## 🔧 **Features in Detail**

### **🏠 AT-HOME Foods Nutrition**
- Personalized diet plans using everyday kitchen ingredients
- No special diet products or expensive supplements required
- Traditional ingredient optimization for health goals

### **🍛 Traditional Cuisine Adaptation**
- Healthy modifications of Telugu and regional Indian recipes
- Cultural sensitivity in nutrition planning
- Maintaining food preferences while achieving health goals

### **🏢 Corporate Wellness Programs**
- Group nutrition education sessions
- Employee health and productivity improvement
- Custom wellness program development

### **📺 Media Consultation Services**
- Nutrition content creation for television and print
- Recipe development for health programs
- Expert commentary and health education

### **🏥 Hospital Partnership Programs**
- Clinical nutrition support for medical facilities
- Healthcare technology integration
- Specialized diet planning for medical conditions

### **📊 Day-to-Day Monitoring**
- Continuous nutrition support and tracking
- Real-time diet adjustments based on progress
- Body signal awareness training

## 📱 **PWA Features**

NutriConnect is built as a Progressive Web App with:

- **📱 Mobile App Experience**: Install on mobile devices like a native app
- **🔄 Offline Functionality**: Basic features work without internet
- **🔔 Push Notifications**: Stay updated with nutrition tips and reminders
- **⚡ Fast Loading**: Optimized performance with caching strategies

## 🔒 **Security Features**

- **🔐 Secure Authentication**: NextAuth with multiple providers
- **🛡️ Data Protection**: Encrypted sensitive information
- **🚫 Rate Limiting**: API protection against abuse
- **📝 Input Validation**: Comprehensive data validation
- **🔍 SQL Injection Protection**: Parameterized queries
- **🔒 HTTPS Enforcement**: Secure communication
- **📊 Audit Logging**: Track important actions

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard
```

### **Alternative Platforms**
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **Render**: Web service deployment
- **DigitalOcean**: VPS deployment

## 📈 **Performance Optimization**

- **⚡ Fast Loading**: Next.js optimization with SSR/SSG
- **🖼️ Image Optimization**: Next.js Image component with lazy loading
- **📦 Code Splitting**: Automatic code splitting for faster page loads
- **🔄 Caching**: Strategic caching for improved performance
- **📱 Mobile First**: Responsive design optimized for mobile devices

## 🧪 **Testing**

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 **Documentation**

- **📖 API Documentation**: Available in `/docs/api.md`
- **🎨 Component Library**: Storybook documentation (planned)
- **📋 User Guides**: Available in `/docs/user-guides/`
- **🔧 Setup Guides**: Comprehensive setup documentation

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **📧 Email**: gouri@dietint.com
- **📱 Phone**: +91 99999 88888
- **📍 Location**: Greater Hyderabad Area, Telangana, India
- **🕐 Hours**: Monday-Friday 10:00 AM - 7:00 PM IST

## 🙏 **Acknowledgments**

- **Gouri Priya Mylavarapu** - Founder and Nutrition Expert
- **EtvLife** - Media partnership and platform support
- **Shadan Institute** - Educational foundation
- **Healthcare Partners** - Clinical collaboration
- **Open Source Community** - Tools and libraries

## 📊 **Project Status**

- ✅ **Production Ready**: Core features implemented and tested
- ✅ **Content Complete**: All nutrition content and recipes integrated
- ✅ **Mobile Optimized**: Responsive design across all devices
- ✅ **PWA Enabled**: Progressive web app functionality
- ⏳ **Continuous Development**: Regular updates and new features

## 🔮 **Roadmap**

### **Phase 1** (Current)
- ✅ Core platform with AT-HOME foods approach
- ✅ Professional content integration
- ✅ User authentication and management
- ✅ PWA capabilities

### **Phase 2** (Planned)
- 🔄 Mobile app (React Native)
- 🔄 Advanced analytics dashboard
- 🔄 AI-powered meal recommendations
- 🔄 Integration with health tracking devices

### **Phase 3** (Future)
- 🔄 Multi-language support (Telugu, Hindi)
- 🔄 Video consultation features
- 🔄 Community features and forums
- 🔄 Advanced nutritional analysis tools

---

**Built with ❤️ by the NutriConnect Team**  
*Empowering Healthy Lifestyles Through Traditional Wisdom and Modern Technology*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nutriconnect-platform)