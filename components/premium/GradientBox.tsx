'use client';

import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

interface GradientBoxProps extends BoxProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'premium' | 'success' | 'info';
  overlay?: boolean;
}

const gradients = {
  primary: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
  secondary: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
  premium: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

export default function GradientBox({
  children,
  variant = 'primary',
  overlay = false,
  sx,
  ...props
}: GradientBoxProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        background: gradients[variant],
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {overlay && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      {children}
    </Box>
  );
}
