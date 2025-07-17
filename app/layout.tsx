'use client';

import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Providers } from '@/components/Providers';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import ChatbotWidget from '@/components/ChatbotWidget';
import { BRAND_CONFIG } from '@/lib/branding';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    primary: {
      main: BRAND_CONFIG.colors.primary,     // Deep green for health/trust
      light: '#60AD5E',
      dark: BRAND_CONFIG.colors.dark,
      contrastText: '#ffffff'
    },
    secondary: {
      main: BRAND_CONFIG.colors.secondary,   // Warm orange for energy
      light: '#FFB74D',
      dark: '#C66900'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    text: {
      primary: BRAND_CONFIG.colors.text.primary,
      secondary: BRAND_CONFIG.colors.text.secondary,
    },
  },
  typography: {
    fontFamily: BRAND_CONFIG.fonts.primary,
    h1: {
      fontFamily: '"Roboto Slab", serif',
      fontWeight: 700,
      fontSize: '3rem',
      '@media (max-width:600px)': {
        fontSize: '2rem'
      }
    },
    h2: {
      fontFamily: '"Roboto Slab", serif',
      fontWeight: 600,
      fontSize: '2.5rem'
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.7
    }
  },
  spacing: 8, // 8px base unit
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48 // Mobile touch target
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 3
      }
    }
  }
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{BRAND_CONFIG.seo.title}</title>
        <meta name="description" content={BRAND_CONFIG.seo.description} />
        <meta name="keywords" content={BRAND_CONFIG.seo.keywords.join(', ')} />
        <meta name="author" content={BRAND_CONFIG.business.name} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={BRAND_CONFIG.social.website} />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content={BRAND_CONFIG.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={BRAND_CONFIG.name} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content={BRAND_CONFIG.colors.primary} />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content={BRAND_CONFIG.colors.primary} />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.svg" />
        
        {/* Splash Screens for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.svg" />
        <meta name="msapplication-TileColor" content={BRAND_CONFIG.colors.primary} />
        
        {/* Additional PWA Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={BRAND_CONFIG.seo.title} />
        <meta property="og:description" content={BRAND_CONFIG.seo.description} />
        <meta property="og:site_name" content={BRAND_CONFIG.name} />
        <meta property="og:url" content={BRAND_CONFIG.social.website} />
        <meta property="og:image" content={BRAND_CONFIG.seo.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${BRAND_CONFIG.name} - ${BRAND_CONFIG.tagline}`} />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={BRAND_CONFIG.seo.twitterCard} />
        <meta name="twitter:title" content={BRAND_CONFIG.seo.title} />
        <meta name="twitter:description" content={BRAND_CONFIG.seo.description} />
        <meta name="twitter:image" content={BRAND_CONFIG.seo.ogImage} />
        <meta name="twitter:site" content={BRAND_CONFIG.social.twitter} />
        <meta name="twitter:creator" content={BRAND_CONFIG.social.twitter} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="40.7589,-73.9851" />
        <meta name="ICBM" content="40.7589,-73.9851" />
        
        {/* Security */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('SW registered: ', registration);
                }, function(registrationError) {
                  console.log('SW registration failed: ', registrationError);
                });
              });
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Providers>
              {children}
              <PWAInstallPrompt />
              <ChatbotWidget />
            </Providers>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}