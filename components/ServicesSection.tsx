'use client';

import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography, Button, Box, Container, Grid } from '@mui/material';

export default function ServicesSection() {
  const services = [
    {
      title: 'AT-HOME Foods Nutrition',
      description: 'Personalized diet plans using everyday kitchen ingredients. No special diet products required - sustainable nutrition with foods you already have.',
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop',
      href: '/auth/register?service=at-home-nutrition'
    },
    {
      title: 'Traditional Cuisine Adaptation',
      description: 'Healthy adaptations of Telugu and regional Indian cuisine. Maintain cultural food preferences while achieving health goals.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
      href: '/auth/register?service=traditional-cuisine'
    },
    {
      title: 'Corporate Wellness Programs',
      description: 'Group nutrition talks and wellness programs for organizations. Improve employee health and productivity through nutrition education.',
      image: 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=800&auto=format&fit=crop',
      href: '/auth/register?service=corporate-wellness'
    },
    {
      title: 'Weight Management (Sustainable)',
      description: 'Research-based weight loss through lifestyle changes. Focus on body signal awareness and long-term sustainability.',
      image: 'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?w=800&auto=format&fit=crop',
      href: '/auth/register?service=weight-management'
    },
    {
      title: 'Media Nutrition Consultation',
      description: 'Expert nutrition content creation for media, recipe development, and health program hosting based on 15+ years TV experience.',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop',
      href: '/auth/register?service=media-consultation'
    },
    {
      title: 'Hospital Partnership Programs',
      description: 'Clinical nutrition support and specialized diet planning for hospital patients and healthcare technology integration.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop',
      href: '/auth/register?service=hospital-partnership'
    },
    {
      title: 'PCOS/PCOD Management',
      description: 'Specialized hormonal balance nutrition using traditional foods and research-based concepts for PCOS symptom management.',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop',
      href: '/auth/register?service=pcos-management'
    },
    {
      title: 'Day-to-Day Monitoring',
      description: 'Continuous nutrition support with daily tracking, body signal awareness training, and real-time diet adjustments.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
      href: '/auth/register?service=daily-monitoring'
    }
  ];

  return (
    <Box id="services" sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Our Services
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Comprehensive nutrition services designed to help you achieve your health and wellness goals.
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
                    Book Consultation
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