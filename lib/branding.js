// Central branding configuration for CoachPulse
const BRAND_CONFIG = {
  // App Identity
  name: 'CoachPulse',
  tagline: 'The Intelligent Platform for Health & Wellness Coaches',
  description: 'Help coaches manage clients with smart alerts, automated nudges, and white-labeled branding',
  
  // Visual Identity
  logo: {
    emoji: '💪🎯',
    text: 'CoachPulse',
    full: '💪🎯 CoachPulse'
  },
  
  // Color Scheme (keeping the existing green theme but optimized)
  colors: {
    primary: '#4CAF50',      // Healthy green
    secondary: '#66BB6A',    // Lighter green
    accent: '#FFC107',       // Warm accent (amber)
    dark: '#2E7D32',         // Dark green
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
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@coachpulse.in',
    phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91-XXXXXXXXXX',
    address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'India',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
  },
  
  // Social Media
  social: {
    website: 'https://coachpulse.in',
    twitter: '@CoachPulseApp',
    facebook: 'CoachPulseApp',
    instagram: '@coachpulse.in',
    linkedin: 'company/coachpulse'
  },
  
  // SEO Configuration
  seo: {
    title: 'CoachPulse - Platform for Health & Wellness Coaches',
    description: 'Manage your coaching clients with smart alerts and automated nudges. ₹200 per client per month. Never lose a client to neglect again.',
    keywords: [
      'nutrition app',
      'diet planning',
      'personalized nutrition',
      'AI nutrition',
      'meal planning',
      'weight management',
      'healthy eating',
      'nutrition consultation',
      'dietitian app',
      'wellness platform'
    ],
    ogImage: '/images/coachpulse-og.jpg',
    twitterCard: 'summary_large_image'
  },
  
  // Business Information
  business: {
    name: 'CoachPulse Professional Coaching',
    type: 'B2B2C Coaching Platform',
    founded: '2024',
    mission: 'To empower coaches to scale with intelligent tools and automation.',
    vision: 'A world where every coach can manage more clients without losing the personal touch.',
    values: [
      'Evidence-based nutrition',
      'Personalized approach',
      'Technology-driven solutions',
      'Holistic wellness',
      'Accessible healthcare'
    ]
  },
  
  // Features Highlight
  features: {
    main: [
      {
        icon: '🧠',
        title: 'AI-Powered Insights',
        description: 'Smart recommendations based on your unique health profile'
      },
      {
        icon: '📋',
        title: 'Personalized Plans',
        description: 'Custom diet plans tailored to your goals and preferences'
      },
      {
        icon: '📱',
        title: 'Smart Tracking',
        description: 'Intelligent progress monitoring with actionable insights'
      },
      {
        icon: '🎯',
        title: 'Goal Achievement',
        description: 'Reach your health goals with expert guidance and AI support'
      }
    ]
  }
};

// Helper functions for consistent branding
const getBrandName = () => BRAND_CONFIG.name;
const getBrandLogo = () => BRAND_CONFIG.logo.full;
const getBrandTagline = () => BRAND_CONFIG.tagline;
const getBrandDescription = () => BRAND_CONFIG.description;
const getPrimaryColor = () => BRAND_CONFIG.colors.primary;
const getSEOTitle = (pageTitle) => 
  pageTitle ? `${pageTitle} | ${BRAND_CONFIG.name}` : BRAND_CONFIG.seo.title;
const getSEODescription = (pageDescription) => 
  pageDescription || BRAND_CONFIG.seo.description;

module.exports = {
  BRAND_CONFIG,
  getBrandName,
  getBrandLogo,
  getBrandTagline,
  getBrandDescription,
  getPrimaryColor,
  getSEOTitle,
  getSEODescription
};
