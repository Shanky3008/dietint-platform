'use client';

import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Providers } from '@/components/Providers';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';
import SWRegister from '@/components/SWRegister';
import { BRAND_CONFIG } from '@/lib/branding';

const theme = createTheme({
  palette: {
    primary: {
      main: BRAND_CONFIG.colors.primary,
      light: '#60AD5E',
      dark: BRAND_CONFIG.colors.dark,
      contrastText: '#ffffff'
    },
    secondary: {
      main: BRAND_CONFIG.colors.secondary,
      light: '#FFB74D',
      dark: '#C66900'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    text: {
      primary: BRAND_CONFIG.colors?.text?.primary || '#2C3E50',
      secondary: BRAND_CONFIG.colors?.text?.secondary || '#546E7A',
    },
  },
  typography: {
    fontFamily: BRAND_CONFIG.fonts?.primary || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
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
  spacing: 8,
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48
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

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
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
  );
}

