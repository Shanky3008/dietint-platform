'use client';

import { Card, CardContent, Typography, Box, Avatar, Rating, Container, Grid } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya — Nutrition Coach',
      role: 'Retention Uplift',
      content: '“Smart alerts helped me spot drop-offs early. My monthly retention improved by ~20% and I spend less time firefighting.”',
      rating: 5,
      avatar: 'PN',
      location: 'Mumbai'
    },
    {
      name: 'Amit — Fitness Coach',
      role: 'Time Saved',
      content: '“Automated nudges feel human and timely. I save 10+ hours every week and clients stay on track without hand-holding.”',
      rating: 5,
      avatar: 'AK',
      location: 'Bengaluru'
    },
    {
      name: 'Meera — Wellness Coach',
      role: 'Client Growth',
      content: '“White-label app under my brand sealed the deal. New clients trust the experience and onboarding is smooth.”',
      rating: 5,
      avatar: 'MW',
      location: 'Hyderabad'
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Coach Wins
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Real improvements in retention, time saved, and client growth — powered by smart alerts and automated nudges.
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
