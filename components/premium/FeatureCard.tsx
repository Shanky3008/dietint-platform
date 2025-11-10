'use client';

import { Box, Typography, alpha } from '@mui/material';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
  delay?: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  gradient = 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
  delay = 0,
}: FeatureCardProps) {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha('#ffffff', 0.3)}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
          '& .feature-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
        },
        '@keyframes fadeInUp': {
          from: {
            opacity: 0,
            transform: 'translateY(30px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Box
        className="feature-icon"
        sx={{
          width: 64,
          height: 64,
          borderRadius: '16px',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          color: 'white',
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 1.5,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.7,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
