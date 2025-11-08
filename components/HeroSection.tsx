'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Box, Chip, Avatar, Rating, Typography, Container, Grid } from '@mui/material';
import { Security, Favorite, FitnessCenter, Star, NaturePeople } from '@mui/icons-material';

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
        
        // Also fetch branding content
        const brandingResponse = await fetch('/api/content?section=branding');
        if (brandingResponse.ok) {
          const brandingData = await brandingResponse.json();
          setContent(prev => ({ 
            ...prev, 
            branding: brandingData.content || {} 
          }));
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #fff7ed 100%)',
      py: { xs: 8, md: 12 }
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2
              }}
            >
              {content.hero?.title?.value || 'The Intelligent Platform for Health & Wellness Coaches'}{' '}
              <Typography component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {content.branding?.app_name?.value || 'CoachPulse'}
              </Typography>
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                color: 'text.secondary',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              {content.hero?.subtitle?.value || 'Retain more clients with smart alerts, automated nudges, and a white‑label client experience.'}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              {content.hero?.description?.value || 'CoachPulse helps you manage 100+ clients as easily as 10 — by surfacing who needs attention, automating follow‑ups that feel human, and keeping your brand front and center.'}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 5 }}>
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                href="/pricing"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                {content.hero?.cta_primary?.value || 'Choose a Plan'}
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                component={Link}
                href="/dashboard/coach"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {content.hero?.cta_secondary?.value || 'Go to Coach Dashboard'}
              </Button>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { icon: <Security />, title: 'Smart Alerts', desc: 'Know who needs attention, when' },
                { icon: <NaturePeople />, title: 'Ghost Prevention', desc: 'Predict disengagement early' },
                { icon: <Favorite />, title: 'Automated Nudges', desc: 'Human‑like reminders at scale' },
                { icon: <FitnessCenter />, title: 'White‑Label Branding', desc: 'Your brand across web + mobile' }
              ].map((feature, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ 
                      mr: 2, 
                      bgcolor: 'primary.100', 
                      p: 1, 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {React.cloneElement(feature.icon, { sx: { color: 'primary.main', fontSize: 24 } })}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            {/* Coach-focused social proof (generic, no personal details) */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Trusted by coaches across India
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Rating value={5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    Proven retention and time savings
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                border: '1px solid',
                borderColor: 'primary.100'
              }}>
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 'bold' }}>
                  Custom Module Templates
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Ready-made coaching modules for different health goals. White-label them with your branding and deliver to clients instantly.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label="Weight Loss Programs"
                    sx={{ bgcolor: 'primary.100', color: 'primary.700' }}
                    size="small"
                  />
                  <Chip
                    label="PCOS Management"
                    sx={{ bgcolor: 'secondary.100', color: 'secondary.700' }}
                    size="small"
                  />
                  <Chip
                    label="Diabetes Care"
                    sx={{ bgcolor: 'warning.100', color: 'warning.700' }}
                    size="small"
                  />
                  <Chip
                    label="Wellness & Lifestyle"
                    sx={{ bgcolor: 'success.100', color: 'success.700' }}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                border: '1px solid',
                borderColor: 'primary.100'
              }}>
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 'bold' }}>
                  Coach Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Manage all your clients in one place. Track engagement, send automated nudges, and keep everyone on track.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  href="/dashboard/coach"
                  sx={{ fontWeight: 'bold' }}
                >
                  Access Coach Dashboard
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
