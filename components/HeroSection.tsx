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
              {content.hero?.title?.value || 'Transform Your Health with Intelligent Nutrition'}{' '}
              <Typography component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {content.branding?.app_name?.value || 'DietInt'}
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
              {content.hero?.subtitle?.value || 'Intelligent nutrition through seamless interaction'}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              {content.hero?.description?.value || 'Experience intelligent nutrition guidance through interactive consultations with certified dietitians. Our smart platform adapts to your needs, providing personalized diet plans and real-time support for your health journey.'}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 5 }}>
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                href="/auth/register"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                {content.hero?.cta_primary?.value || 'Get Started Today'}
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                component={Link}
                href="#services"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {content.hero?.cta_secondary?.value || 'Learn More'}
              </Button>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { icon: <Security />, title: 'AI-Powered Intelligence', desc: 'Smart nutrition recommendations' },
                { icon: <NaturePeople />, title: 'Interactive Consultations', desc: 'Real-time dietitian support' },
                { icon: <Favorite />, title: 'Adaptive Learning', desc: 'Plans that evolve with you' },
                { icon: <FitnessCenter />, title: 'Smart Tracking', desc: 'Intelligent progress monitoring' }
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
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', mr: 2 }}>
                <Avatar sx={{ bgcolor: 'orange.400', width: 40, height: 40, fontSize: '0.875rem', mr: -1 }}>NK</Avatar>
                <Avatar sx={{ bgcolor: 'blue.400', width: 40, height: 40, fontSize: '0.875rem', mr: -1 }}>TM</Avatar>
                <Avatar sx={{ bgcolor: 'green.400', width: 40, height: 40, fontSize: '0.875rem' }}>RR</Avatar>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Trusted by <Typography component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>500+</Typography> satisfied clients
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Rating value={5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    Top rated
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
                  Personalized Nutrition Plans
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Custom diet solutions tailored to your specific health goals, food preferences, and lifestyle needs.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label="Weight Management" 
                    sx={{ bgcolor: 'primary.100', color: 'primary.700' }}
                    size="small"
                  />
                  <Chip 
                    label="PCOS/PCOD" 
                    sx={{ bgcolor: 'secondary.100', color: 'secondary.700' }}
                    size="small"
                  />
                  <Chip 
                    label="Diabetes" 
                    sx={{ bgcolor: 'warning.100', color: 'warning.700' }}
                    size="small"
                  />
                  <Chip 
                    label="Healthy Lifestyle" 
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
                  Online Consultations
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Connect with our expert nutritionist from anywhere for personalized advice and guidance.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  component={Link}
                  href="/auth/register"
                  sx={{ fontWeight: 'bold' }}
                >
                  Book Appointment
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}