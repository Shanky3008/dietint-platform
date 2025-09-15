'use client';

import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography, Button, Box, Container, Grid } from '@mui/material';

export default function ServicesSection() {
  const services = [
    {
      title: 'Smart Alerts',
      description: 'Instantly know who needs attention ("Priya hasn\'t logged lunch"). Triage by priority with real-time signals.',
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop',
      href: '/dashboard/coach'
    },
    {
      title: 'Ghost Prevention',
      description: 'Predict disengagement early and intervene before clients go silent. Protect retention and revenue.',
      image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&auto=format&fit=crop',
      href: '/dashboard/coach'
    },
    {
      title: 'Automated Nudges',
      description: 'Personalized reminders at scale — timing, context, and tone that feel human, not spam.',
      image: 'https://images.unsplash.com/photo-1497493292307-31c376b6e479?w=800&auto=format&fit=crop',
      href: '/dashboard/coach'
    },
    {
      title: 'White-Label Branding',
      description: 'Your domain, logo, and colors across web and mobile. Professional client experience under your brand.',
      image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&auto=format&fit=crop',
      href: '/pricing'
    },
    {
      title: 'Client CRM + Assignments',
      description: 'Manage client lists, assign plans, track adherence, and log conversations — all in one place.',
      image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&auto=format&fit=crop',
      href: '/dashboard/coach/clients'
    },
    {
      title: 'Analytics for Coaches',
      description: 'Understand engagement, outcomes, and trends at a glance. Focus on actions that move the needle.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      href: '/dashboard/coach'
    }
  ];

  return (
    <Box id="services" sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Platform Modules for Coaches
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Tools that help you retain more clients, save time, and scale — under your brand.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    boxShadow: 4,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                    {service.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    href={service.href}
                    sx={{ 
                      bgcolor: 'primary.main', 
                      '&:hover': { bgcolor: 'primary.dark' },
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
