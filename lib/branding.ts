// Central branding configuration for CoachPulse
export const BRAND_CONFIG = {
  // App Identity
  name: 'CoachPulse',
  tagline: 'The Intelligent Platform for Health & Wellness Coaches',
  description: 'Help coaches manage their clients effortlessly with smart alerts, automated nudges, and white-labeled branding',
  
  // Visual Identity
  logo: { emoji: '💪🎯', text: 'CoachPulse', full: '💪🎯 CoachPulse' },
  
  // Color Scheme (Professional coaching brand colors)
  colors: {
    primary: '#2E7D32',      // Deep green for health/trust
    secondary: '#FF9800',    // Warm orange for energy
    accent: '#03A9F4',       // Light blue for credibility
    dark: '#005005',         // Very dark green
    light: '#E8F5E8',        // Very light green
    text: {
      primary: '#2C3E50',    // Dark blue-gray
      secondary: '#546E7A',   // Medium gray
      light: '#78909C'       // Light gray
    }
  },
  
  // Typography
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    heading: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'Monaco, Consolas, monospace'
  },
  
  // Contact Information
  contact: { email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@coachpulse.in', phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91-XXXXXXXXXX', address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'India', hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM' },
  
  // Social Media
  social: { website: 'https://coachpulse.in', twitter: '@CoachPulseApp', facebook: 'CoachPulseApp', instagram: '@coachpulse.in', linkedin: 'company/coachpulse' },
  
  // SEO Configuration
  seo: {
    title: 'CoachPulse - Platform for Health & Wellness Coaches',
    description: 'Manage your coaching clients with smart alerts and automated nudges. ₹200 per client per month. Never lose a client to neglect again.',
    keywords: [
      'health coach platform',
      'wellness coach software',
      'nutrition coach management',
      'client engagement platform',
      'coaching business automation',
      'client retention software',
      'health coaching tools',
      'nutrition coaching platform',
      'coach dashboard',
      'white-label coaching app',
      'automated client nudges',
      'coaching client management'
    ],
    ogImage: '/images/coachpulse-og.jpg',
    twitterCard: 'summary_large_image'
  },
  
  // Business Information
  business: {
    name: 'CoachPulse Professional Coaching',
    type: 'B2B2C Coaching Platform',
    founded: '2024',
    mission: 'To empower health and wellness coaches with intelligent tools that help them manage more clients while never losing anyone to neglect.',
    vision: 'A world where every coach can scale their practice with smart automation and data-driven insights.',
    values: [ 'Coach empowerment', 'Client retention focus', 'Smart automation', 'Data-driven insights', 'Scalable solutions' ]
  },
  
  // Features Highlight
  features: {
    main: [
      {
        icon: '🧠',
        title: 'Diet Intelligence',
        description: 'Smart AI-powered nutrition recommendations that adapt to your needs'
      },
      {
        icon: '💬',
        title: 'Interactive Consultations',
        description: 'Seamless real-time interaction with expert dietitians'
      },
      {
        icon: '🔄',
        title: 'Adaptive Learning',
        description: 'Platform learns from your progress and adjusts recommendations'
      },
      {
        icon: '🎯',
        title: 'Intelligent Tracking',
        description: 'Smart monitoring with interactive feedback and insights'
      }
    ]
  }
};

// Helper functions for consistent branding
export const getBrandName = () => BRAND_CONFIG.name;
export const getBrandLogo = () => BRAND_CONFIG.logo.full;
export const getBrandTagline = () => BRAND_CONFIG.tagline;
export const getBrandDescription = () => BRAND_CONFIG.description;
export const getPrimaryColor = () => BRAND_CONFIG.colors.primary;
export const getSEOTitle = (pageTitle?: string) => 
  pageTitle ? `${pageTitle} | ${BRAND_CONFIG.name}` : BRAND_CONFIG.seo.title;
export const getSEODescription = (pageDescription?: string) => 
  pageDescription || BRAND_CONFIG.seo.description;
