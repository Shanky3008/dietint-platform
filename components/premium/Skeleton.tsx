'use client';

import { Box, BoxProps } from '@mui/material';

interface SkeletonProps extends BoxProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  animation = 'wave',
  sx,
  ...props
}: SkeletonProps) {
  const getHeight = () => {
    if (height) return height;
    if (variant === 'text') return '1.2em';
    if (variant === 'circular') return 40;
    return 200;
  };

  const getBorderRadius = () => {
    if (variant === 'circular') return '50%';
    if (variant === 'text') return '8px';
    return '16px';
  };

  return (
    <Box
      sx={{
        width,
        height: getHeight(),
        borderRadius: getBorderRadius(),
        background:
          animation === 'wave'
            ? 'linear-gradient(90deg, rgba(0, 0, 0, 0.06) 25%, rgba(0, 0, 0, 0.10) 50%, rgba(0, 0, 0, 0.06) 75%)'
            : 'rgba(0, 0, 0, 0.08)',
        backgroundSize: animation === 'wave' ? '200% 100%' : 'auto',
        animation:
          animation === 'wave'
            ? 'shimmer 1.5s ease-in-out infinite'
            : animation === 'pulse'
            ? 'pulse 1.5s ease-in-out infinite'
            : 'none',
        '@keyframes shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        '@keyframes pulse': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.6,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
}
