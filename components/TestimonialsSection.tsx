'use client';

import { Card, CardContent, Typography, Box, Avatar, Rating, Container, Grid } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Meera Reddy',
      role: 'Weight Loss Success',
      content: 'Unlike other dieticians who just tell what to eat, Gouri helps with recipes that suit both my palette and diet plan. She helped me realize that healthy food can taste good! Lost 12kg in 5 months.',
      rating: 5,
      avatar: 'MR',
      location: 'Hyderabad'
    },
    {
      name: 'Vikram Nair',
      role: 'Corporate Wellness',
      content: 'Gouri provides detailed diet charts based on individual routines and explains the planning clearly. Her AT-HOME foods approach made it easy to follow even with my busy schedule.',
      rating: 5,
      avatar: 'VN',
      location: 'Bangalore'
    },
    {
      name: 'Lakshmi Iyer',
      role: 'Traditional Cuisine Adaptation',
      content: 'What I love about Gouri\'s approach is how she adapts our traditional Telugu recipes to make them healthier. No need for expensive diet products - everything uses ingredients from my kitchen!',
      rating: 5,
      avatar: 'LI',
      location: 'Chennai'
    },
    {
      name: 'Suresh Gupta',
      role: 'Lifestyle Transformation',
      content: 'Gouri\'s research-based concepts with day-to-day monitoring helped me understand my body signals. The sustainable approach means I haven\'t gained back the weight I lost.',
      rating: 5,
      avatar: 'SG',
      location: 'Mumbai'
    },
    {
      name: 'Priyanka Sharma',
      role: 'Family Nutrition',
      content: 'As a working mother, I needed practical solutions. Gouri\'s meal plans work for the whole family and her TV show recipes have become our favorites. My kids actually ask for healthy snacks now!',
      rating: 5,
      avatar: 'PS',
      location: 'Delhi'
    },
    {
      name: 'Rajesh Patel',
      role: 'Diabetes Management',
      content: 'Gouri\'s expertise from working with hospitals really shows. Her diabetic-friendly adaptations of traditional foods have helped me manage my blood sugar while enjoying the foods I love.',
      rating: 5,
      avatar: 'RP',
      location: 'Pune'
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Success Stories
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Real transformations from our satisfied clients who achieved their health goals with our guidance.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    boxShadow: 4,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'primary.main',
                    opacity: 0.3
                  }}
                >
                  <FormatQuote sx={{ fontSize: 40 }} />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Rating 
                    value={testimonial.rating} 
                    readOnly 
                    size="small" 
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      flexGrow: 1, 
                      mb: 3,
                      fontStyle: 'italic',
                      lineHeight: 1.6
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 48, 
                        height: 48, 
                        mr: 2,
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'medium' }}>
                        {testimonial.role}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}