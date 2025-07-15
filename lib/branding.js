// Central branding configuration for DietInt
const BRAND_CONFIG = {
  // App Identity
  name: 'DietInt',
  tagline: 'Intelligent Nutrition, Personalized Results',
  description: 'AI-powered nutrition guidance and personalized diet plans for optimal health',
  
  // Visual Identity
  logo: {
    emoji: '🧠',
    text: 'DietInt',
    full: '🧠 DietInt'
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
    email: 'hello@dietint.com',
    phone: '+91 9876543210',
    address: 'DietInt Nutrition Services, India',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
  },
  
  // Social Media
  social: {
    website: 'https://dietint.com',
    twitter: '@DietIntApp',
    facebook: 'DietIntApp',
    instagram: '@dietint.com',
    linkedin: 'company/dietint'
  },
  
  // SEO Configuration
  seo: {
    title: 'DietInt - Intelligent Nutrition & Personalized Diet Plans',
    description: 'Transform your health with AI-powered nutrition guidance. Get personalized diet plans, expert consultations, and smart meal recommendations with DietInt.',
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
    ogImage: '/images/dietint-og.jpg',
    twitterCard: 'summary_large_image'
  },
  
  // Business Information
  business: {
    name: 'DietInt Nutrition Services',
    type: 'Nutrition Consulting Platform',
    founded: '2024',
    mission: 'To make intelligent nutrition guidance accessible to everyone through personalized, AI-powered solutions.',
    vision: 'A world where everyone has access to smart, personalized nutrition guidance for optimal health.',
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