'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Box, Chip, Rating, Typography, Container, Grid } from '@mui/material';
import { Security, Favorite, FitnessCenter, NaturePeople, TrendingUp, AutoAwesome } from '@mui/icons-material';
import { GradientBox, FeatureCard, Skeleton } from '@/components/premium';

interface ContentData {
  hero?: {
    title?: { value: string };
    subtitle?: { value: string };
    description?: { value: string };
    cta_primary?: { value: string };
    cta_secondary?: { value: string };
  };
  branding?: {
    app_name?: { value: string };
  };
}

export default function HeroSection() {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?section=hero');
        if (response.ok) {
          const data = await response.json();
          setContent(data.content || {});
        }

        const brandingResponse = await fetch('/api/content?section=branding');
        if (brandingResponse.ok) {
          const brandingData = await brandingResponse.json();
          setContent(prev => ({
            ...prev,
            branding: brandingData.content || {}
          }));
        }
      } catch (error) {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <GradientBox variant="premium" overlay>
      <Box sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 12, md: 16 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(-50px, 30px) scale(1.1)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            animation: 'float 15s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />

        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {loading ? (
                  <>
                    {/* Badge Skeleton */}
                    <Box sx={{ mb: 3 }}>
                      <Skeleton width={280} height={48} sx={{ borderRadius: '24px' }} />
                    </Box>

                    {/* Main Heading Skeleton */}
                    <Box sx={{ mb: 3 }}>
                      <Skeleton width="100%" height={60} sx={{ mb: 2 }} />
                      <Skeleton width="90%" height={60} />
                    </Box>

                    {/* Subtitle Skeleton */}
                    <Box sx={{ mb: 4 }}>
                      <Skeleton width="100%" height={32} sx={{ mb: 1.5 }} />
                      <Skeleton width="95%" height={32} />
                    </Box>

                    {/* Description Skeleton */}
                    <Box sx={{ mb: 5 }}>
                      <Skeleton width="100%" height={24} sx={{ mb: 1 }} />
                      <Skeleton width="100%" height={24} sx={{ mb: 1 }} />
                      <Skeleton width="85%" height={24} />
                    </Box>

                    {/* CTA Buttons Skeleton */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 6 }}>
                      <Skeleton width={180} height={56} sx={{ borderRadius: '14px' }} />
                      <Skeleton width={180} height={56} sx={{ borderRadius: '14px' }} />
                    </Box>

                    {/* Social Proof Skeleton */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton width={120} height={24} />
                      <Skeleton width={200} height={20} />
                    </Box>
                  </>
                ) : (
                  <>
                    {/* Badge */}
                    <Box sx={{ mb: 3, animation: 'fadeInDown 0.6s ease-out' }}>
                      <Chip
                        icon={<AutoAwesome sx={{ fontSize: 18 }} />}
                        label="AI-Powered Client Management"
                        sx={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          px: 2,
                          py: 3,
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </Box>

                    {/* Main Heading */}
                    <Typography
                      variant="h1"
                      sx={{
                        color: 'white',
                        mb: 3,
                        fontWeight: 800,
                        textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                        animation: 'fadeInUp 0.6s ease-out 0.1s both',
                        '@keyframes fadeInDown': {
                          from: { opacity: 0, transform: 'translateY(-20px)' },
                          to: { opacity: 1, transform: 'translateY(0)' },
                        },
                        '@keyframes fadeInUp': {
                          from: { opacity: 0, transform: 'translateY(30px)' },
                          to: { opacity: 1, transform: 'translateY(0)' },
                        },
                      }}
                    >
                      {content.hero?.title?.value || 'The Intelligent Platform for Health & Wellness Coaches'}
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        mb: 4,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        animation: 'fadeInUp 0.6s ease-out 0.2s both',
                      }}
                    >
                      {content.hero?.subtitle?.value || 'Retain more clients with smart alerts, automated nudges, and a white‑label client experience.'}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        mb: 5,
                        fontSize: '1.125rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        textShadow: '0 1px 8px rgba(0,0,0,0.15)',
                        animation: 'fadeInUp 0.6s ease-out 0.3s both',
                      }}
                    >
                      {content.hero?.description?.value || 'CoachPulse helps you manage 100+ clients as easily as 10 — by surfacing who needs attention, automating follow‑ups that feel human, and keeping your brand front and center.'}
                    </Typography>

                    {/* CTAs */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 3,
                      mb: 6,
                      animation: 'fadeInUp 0.6s ease-out 0.4s both',
                    }}>
                      <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        href="/pricing"
                        sx={{
                          background: 'white',
                          color: 'primary.main',
                          px: 5,
                          py: 2,
                          fontSize: '1.125rem',
                          fontWeight: 700,
                          borderRadius: '14px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                          '&:hover': {
                            background: 'white',
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                          },
                        }}
                      >
                        {content.hero?.cta_primary?.value || 'Start Free Trial'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        component={Link}
                        href="/dashboard/coach"
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          color: 'white',
                          borderWidth: '2px',
                          px: 5,
                          py: 2,
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          borderRadius: '14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            borderColor: 'white',
                            borderWidth: '2px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-4px)',
                          },
                        }}
                      >
                        {content.hero?.cta_secondary?.value || 'View Demo'}
                      </Button>
                    </Box>

                    {/* Social Proof */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      animation: 'fadeInUp 0.6s ease-out 0.5s both',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={5} readOnly size="small" sx={{ color: '#FFB800' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                        Trusted by 500+ coaches across India
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3,
                animation: 'fadeIn 0.8s ease-out 0.3s both',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}>
                <FeatureCard
                  icon={<Security sx={{ fontSize: 32 }} />}
                  title="Smart Alerts"
                  description="Know exactly who needs attention and when, with AI-powered insights"
                  delay={0.2}
                />
                <FeatureCard
                  icon={<TrendingUp sx={{ fontSize: 32 }} />}
                  title="Ghost Prevention"
                  description="Predict disengagement early with behavioral analysis"
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  delay={0.3}
                />
                <FeatureCard
                  icon={<Favorite sx={{ fontSize: 32 }} />}
                  title="Auto Nudges"
                  description="Human-like automated reminders that keep clients engaged"
                  gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
                  delay={0.4}
                />
                <FeatureCard
                  icon={<FitnessCenter sx={{ fontSize: 32 }} />}
                  title="White-Label"
                  description="Your brand across web and mobile apps"
                  gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                  delay={0.5}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </GradientBox>
  );
}
