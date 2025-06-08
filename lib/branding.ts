// Central branding configuration for NutriWise
export const BRAND_CONFIG = {
  // App Identity
  name: 'NutriWise',
  tagline: 'Intelligent Nutrition, Personalized Results',
  description: 'AI-powered nutrition guidance and personalized diet plans for optimal health',
  
  // Visual Identity
  logo: {
    emoji: '🧠',
    text: 'NutriWise',
    full: '🧠 NutriWise'
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
    email: 'hello@nutriwise.app',
    phone: '+1 (555) 123-WISE',
    address: '123 Wellness Street, Health City, HC 12345',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
  },
  
  // Social Media
  social: {
    website: 'https://nutriwise.app',
    twitter: '@NutriWiseApp',
    facebook: 'NutriWiseApp',
    instagram: '@nutriwise.app',
    linkedin: 'company/nutriwise'
  },
  
  // SEO Configuration
  seo: {
    title: 'NutriWise - Intelligent Nutrition & Personalized Diet Plans',
    description: 'Transform your health with AI-powered nutrition guidance. Get personalized diet plans, expert consultations, and smart meal recommendations with NutriWise.',
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
    ogImage: '/images/nutriwise-og.jpg',
    twitterCard: 'summary_large_image'
  },
  
  // Business Information
  business: {
    name: 'NutriWise Nutrition Services',
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
export const getBrandName = () => BRAND_CONFIG.name;
export const getBrandLogo = () => BRAND_CONFIG.logo.full;
export const getBrandTagline = () => BRAND_CONFIG.tagline;
export const getBrandDescription = () => BRAND_CONFIG.description;
export const getPrimaryColor = () => BRAND_CONFIG.colors.primary;
export const getSEOTitle = (pageTitle?: string) => 
  pageTitle ? `${pageTitle} | ${BRAND_CONFIG.name}` : BRAND_CONFIG.seo.title;
export const getSEODescription = (pageDescription?: string) => 
  pageDescription || BRAND_CONFIG.seo.description;