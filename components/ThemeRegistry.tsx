'use client';

import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Providers } from '@/components/Providers';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';
import SWRegister from '@/components/SWRegister';
import { BRAND_CONFIG } from '@/lib/branding';

// Premium Design Tokens
const premiumTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: BRAND_CONFIG.colors.primary, // '#2E7D32'
      600: '#2C6B2F',
      700: '#1B5E20',
      800: '#16501C',
      900: '#0D3B14',
      main: BRAND_CONFIG.colors.primary,
      light: '#60AD5E',
      dark: BRAND_CONFIG.colors.dark,
      contrastText: '#ffffff',
    },
    secondary: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: BRAND_CONFIG.colors.secondary, // '#FF9800'
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
      main: BRAND_CONFIG.colors.secondary,
      light: '#FFB74D',
      dark: '#C66900',
      contrastText: '#ffffff',
    },
    accent: {
      main: BRAND_CONFIG.colors.accent, // '#03A9F4'
      light: '#4FC3F7',
      dark: '#0277BD',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: BRAND_CONFIG.colors?.text?.primary || '#1A202C',
      secondary: BRAND_CONFIG.colors?.text?.secondary || '#4A5568',
    },
    divider: alpha('#000000', 0.08),
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
  },

  typography: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      '@media (max-width:900px)': {
        fontSize: '2.75rem',
      },
      '@media (max-width:600px)': {
        fontSize: '2.25rem',
      },
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (max-width:900px)': {
        fontSize: '2.5rem',
      },
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.7,
      letterSpacing: '0.005em',
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },

  spacing: 8,

  shape: {
    borderRadius: 16,
  },

  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.06)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.1)',
    '0px 16px 32px rgba(0, 0, 0, 0.12)',
    '0px 20px 40px rgba(0, 0, 0, 0.14)',
    '0px 24px 48px rgba(0, 0, 0, 0.16)',
    '0px 32px 64px rgba(0, 0, 0, 0.18)',
    '0px 40px 80px rgba(0, 0, 0, 0.2)',
    // Glassmorphism shadows
    '0px 8px 32px rgba(0, 0, 0, 0.08)',
    '0px 12px 40px rgba(0, 0, 0, 0.1)',
    '0px 16px 48px rgba(0, 0, 0, 0.12)',
    '0px 20px 56px rgba(0, 0, 0, 0.14)',
    '0px 24px 64px rgba(0, 0, 0, 0.16)',
    '0px 28px 72px rgba(0, 0, 0, 0.18)',
    '0px 32px 80px rgba(0, 0, 0, 0.2)',
    '0px 36px 88px rgba(0, 0, 0, 0.22)',
    '0px 40px 96px rgba(0, 0, 0, 0.24)',
    '0px 44px 104px rgba(0, 0, 0, 0.26)',
    '0px 48px 112px rgba(0, 0, 0, 0.28)',
    '0px 52px 120px rgba(0, 0, 0, 0.3)',
    '0px 56px 128px rgba(0, 0, 0, 0.32)',
    '0px 60px 136px rgba(0, 0, 0, 0.34)',
    '0px 64px 144px rgba(0, 0, 0, 0.36)',
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '14px 32px',
          borderRadius: '12px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(46, 125, 50, 0.25)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #0D3B14 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        sizeSmall: {
          padding: '10px 24px',
          fontSize: '0.9375rem',
        },
        sizeLarge: {
          padding: '16px 40px',
          fontSize: '1.125rem',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        elevation1: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.14)',
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontWeight: 500,
          fontSize: '0.875rem',
          height: '32px',
        },
        filled: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(BRAND_CONFIG.colors.primary, 0.5),
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },

    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          '@media (min-width: 1280px)': {
            maxWidth: '1200px',
          },
        },
        maxWidthXl: {
          '@media (min-width: 1536px)': {
            maxWidth: '1400px',
          },
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={premiumTheme}>
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
