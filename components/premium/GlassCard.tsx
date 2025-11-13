'use client';

import { Box, BoxProps, alpha } from '@mui/material';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<BoxProps, 'border'> {
  children: ReactNode;
  blur?: number;
  opacity?: number;
  showBorder?: boolean;
  hover?: boolean;
}

export default function GlassCard({
  children,
  blur = 20,
  opacity = 0.7,
  showBorder = true,
  hover = true,
  sx,
  ...props
}: GlassCardProps) {
  return (
    <Box
      sx={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
        borderRadius: '24px',
        border: showBorder ? `1px solid ${alpha('#ffffff', 0.3)}` : 'none',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
            background: `rgba(255, 255, 255, ${Math.min(opacity + 0.1, 1)})`,
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
