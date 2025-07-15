import React from 'react';
import { CircularProgress, Box, Typography, Skeleton } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  variant?: 'circular' | 'skeleton' | 'dots';
  color?: 'primary' | 'secondary' | 'inherit';
}

export function LoadingSpinner({ 
  size = 40, 
  message, 
  variant = 'circular',
  color = 'primary' 
}: LoadingSpinnerProps) {
  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="80%" height={30} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (variant === 'dots') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: color === 'primary' ? 'primary.main' : 'secondary.main',
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                '@keyframes bounce': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0)',
                  },
                  '40%': {
                    transform: 'scale(1)',
                  },
                },
              }}
            />
          ))}
        </Box>
        {message && (
          <Typography variant="body2" sx={{ ml: 2 }} color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2 
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

// Table Loading Skeleton
export function TableLoadingSkeleton({ rows = 5, columns = 4 }) {
  return (
    <Box sx={{ width: '100%' }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / columns}%`}
              height={40}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

// Card Loading Skeleton
export function CardLoadingSkeleton({ count = 3 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Skeleton variant="text" width="70%" height={30} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="50%" height={20} />
          <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  );
}

// Button Loading State
export function LoadingButton({ 
  loading, 
  children, 
  ...props 
}: { 
  loading: boolean; 
  children: React.ReactNode; 
  [key: string]: any; 
}) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Box 
        component="button" 
        {...props}
        disabled={loading || props.disabled}
        sx={{
          ...props.sx,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {children}
      </Box>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
}

// Page Loading Overlay
export function PageLoadingOverlay({ loading, message = 'Loading...' }: { 
  loading: boolean; 
  message?: string 
}) {
  if (!loading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

export default LoadingSpinner;