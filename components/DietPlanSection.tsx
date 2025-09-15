'use client';

import Link from 'next/link';
import { Card, CardContent, Typography, Button, Box, Chip, Container, Grid } from '@mui/material';

export default function DietPlanSection() {
  const dietPlans = [
    {
      title: 'Weight Loss Template',
      description: 'A starter template coaches can adapt and assign to clients for safe, sustainable weight loss.',
      features: ['Adjustable macros', 'Meal swap guidance', 'Snack options', 'Indian cuisine variants'],
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop',
      popular: true
    },
    {
      title: 'Diabetes-Friendly Template',
      description: 'Low GI template to help clients manage blood sugar levels. Ready to personalize and assign.',
      features: ['Low GI foods', 'Fiber-rich', 'Portion guidance', 'Regional options'],
      image: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=800&auto=format&fit=crop',
      popular: false
    },
    {
      title: 'PCOS Management Template',
      description: 'A hormone-balancing template for coach customization and assignment to clients.',
      features: ['Anti-inflammatory', 'Low GI', 'Nutrient-dense', 'Satisfying'],
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
      popular: false
    }
  ];

  return (
    <Box sx={{ 
      py: 8, 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Plan Templates Library
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Ready-to-use templates coaches can adapt and assign — speeding up plan creation without losing personalization.
          </Typography>
        </Box>
        
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {dietPlans.map((plan, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    color="secondary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1,
                      fontWeight: 'bold'
                    }}
                  />
                )}
                
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${plan.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {plan.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {plan.description}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {plan.features.map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      component={Link}
                      href="/dashboard/coach"
                      sx={{ 
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'primary.50' },
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Use This Template
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/auth/register"
            sx={{ 
              bgcolor: 'primary.main', 
              '&:hover': { bgcolor: 'primary.dark' },
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Start Your Personalized Journey
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
