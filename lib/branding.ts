// Central branding configuration for DietInt
export const BRAND_CONFIG = {
  // App Identity
  name: 'DietInt',
  tagline: 'Diet Intelligence • Diet Interaction',
  description: 'Intelligent nutrition guidance through seamless interaction with expert dietitians',
  
  // Visual Identity
  logo: {
    emoji: '🧠💬',
    text: 'DietInt',
    full: '🧠💬 DietInt'
  },
  
  // Color Scheme (DietInt brand colors)
  colors: {
    primary: '#2E8B57',      // Sea green (intelligence)
    secondary: '#32CD32',    // Lime green (interaction)
    accent: '#FFD700',       // Gold accent
    dark: '#1B5E20',         // Dark green
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
    phone: '+1 (555) 123-DIET',
    address: '123 Wellness Street, Health City, HC 12345',
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
    title: 'DietInt - Diet Intelligence & Interaction Platform',
    description: 'Experience intelligent nutrition guidance through seamless interaction with expert dietitians. Get personalized diet plans, smart recommendations, and real-time support with DietInt.',
    keywords: [
      'diet intelligence',
      'nutrition interaction',
      'smart nutrition',
      'intelligent diet planning',
      'interactive dietitian',
      'AI nutrition guidance',
      'personalized diet plans',
      'nutrition consultation',
      'dietitian platform',
      'smart meal planning'
    ],
    ogImage: '/images/dietint-og.jpg',
    twitterCard: 'summary_large_image'
  },
  
  // Business Information
  business: {
    name: 'DietInt Nutrition Platform',
    type: 'Intelligent Nutrition Interaction Platform',
    founded: '2024',
    mission: 'To revolutionize nutrition guidance by combining artificial intelligence with seamless human interaction for personalized health outcomes.',
    vision: 'A world where intelligent nutrition guidance and expert interaction create lasting health transformations for everyone.',
    values: [
      'Intelligent nutrition solutions',
      'Seamless interaction experience',
      'Evidence-based recommendations',
      'Personalized approach',
      'Accessible expert guidance'
    ]
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