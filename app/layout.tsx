import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Providers } from '@/components/Providers';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';
import { BRAND_CONFIG } from '@/lib/branding';
import SWRegister from '@/components/SWRegister';
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
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Providers>
              <Navbar />
              {children}
              <PWAInstallPrompt />
              <ChatbotWidget />
              <SWRegister />
            </Providers>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: BRAND_CONFIG.seo.title,
  description: BRAND_CONFIG.seo.description,
  applicationName: BRAND_CONFIG.name,
  manifest: '/manifest.json',
  themeColor: BRAND_CONFIG.colors.primary,
  openGraph: {
    type: 'website',
    title: BRAND_CONFIG.seo.title,
    description: BRAND_CONFIG.seo.description,
    siteName: BRAND_CONFIG.name,
    url: BRAND_CONFIG.social.website,
    images: [{ url: BRAND_CONFIG.seo.ogImage, width: 1200, height: 630, alt: `${BRAND_CONFIG.name} - ${BRAND_CONFIG.tagline}` }]
  },
  twitter: {
    card: BRAND_CONFIG.seo.twitterCard,
    title: BRAND_CONFIG.seo.title,
    description: BRAND_CONFIG.seo.description,
    images: [BRAND_CONFIG.seo.ogImage]
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: ['/icons/icon-192x192.svg', '/icons/icon-152x152.svg', '/icons/icon-192x192.svg']
  }
} as const;
