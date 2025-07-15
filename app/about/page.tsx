'use client';

import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Rating,
  Chip
} from '@mui/material';
import { 
  EmojiEvents as Award, 
  School, 
  People, 
  Schedule,
  CheckCircle
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const certifications = [
    'MSc Nutrition - Shadan Institute of P.G. Studies',
    'Professional Nutritionist & Health Coach',
    'Weight Management Specialist',
    'Media Nutrition Consultant',
    'Corporate Wellness Expert',
    'Telugu Television Health Program Host'
  ];

  const highlights = [
    {
      icon: <Award sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Expert Experience',
      description: '11+ years of professional nutrition experience across hospitals and healthcare organizations.'
    },
    {
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Client Success',
      description: 'Helped hundreds of clients achieve their health and nutrition goals.'
    },
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Media Presence',
      description: 'Regular contributions to magazines, newspapers, and television programs on nutrition topics.'
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Personalized Approach',
      description: 'Individualized nutrition plans tailored to your specific health needs and goals.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fff7ed 100%)',
          py: { xs: 8, md: 12 }
        }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Meet Our Expert
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                Get to know the nutritionist behind DietInt's personalized approach to dietary wellness.
              </Typography>
            </Box>
            
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} lg={4}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 250,
                      height: 250,
                      mx: 'auto',
                      bgcolor: 'primary.100',
                      fontSize: '3rem',
                      mb: 2
                    }}
                  >
                    GPM
                  </Avatar>
                  <Chip 
                    label="11+ Years Experience" 
                    color="primary" 
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                    EtvLife Nutritionist
                  </Typography>
                </Box>
                
                <Card sx={{ mt: 4 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 'bold' }}>
                      Certifications
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {certifications.map((cert, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <CheckCircle sx={{ color: 'primary.main', mr: 1, mt: 0.5, fontSize: 20 }} />
                          <Typography variant="body2">{cert}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} lg={8}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Gouri Priya Mylavarapu
                </Typography>
                <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 'medium' }}>
                  MSc Nutrition | Professional Nutritionist & Health Coach
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  11+ Years of Transforming Lives Through Sustainable Nutrition
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                    I am an experienced nutrition professional with more than 11 years of experience in transforming the lifestyle of numerous individuals. Having been associated with multiple hospitals, fitness centers and successful health care technology start-ups, I have successfully built healthy proprietary diet plans customized based on individual's challenges.
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                    I constantly write columns for newsprint media and several magazines and share my thoughts on healthy lifestyle in various television channels. To top this, I host programs on top Telugu channels where I recommend healthy recipes, bringing nutrition education to diverse communities.
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, fontWeight: 'medium', color: 'primary.main' }}>
                    "A lifestyle change is the key to lead a healthy life and your health coach (nutritionist) is the one who will guide you to reach the light of that tunnel."
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                    My philosophy centers on the belief that I will become your guide, who will constantly motivate and let you be the driver of your car to reach your destination. At DietInt, my approach focuses on "the most liked way of following diet with expected results" by enhancing daily eating routine patterns with AT-HOME foods, following research-based concepts with day-to-day monitoring, and allowing the body to follow its signals for healthy weight loss.
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                    With expertise in nutrition, exercise, sleep, and stress management, I provide holistic care that addresses all aspects of wellness. My method emphasizes sustainable lifestyle changes over extreme measures, ensuring that healthy eating becomes a natural and enjoyable part of your daily routine.
                  </Typography>
                </Box>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {highlights.map((highlight, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          mr: 2, 
                          bgcolor: 'primary.100', 
                          p: 1.5, 
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {highlight.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {highlight.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {highlight.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={5} readOnly sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      5.0 rating from 500+ clients
                    </Typography>
                  </Box>
                  
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
                    Schedule a Consultation
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        
        {/* Location Section */}
        <Box sx={{ py: 8, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Our Location
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                Visit us at our office in Mumbai for in-person consultations.
              </Typography>
            </Box>
            
            <Card sx={{ maxWidth: 600, mx: 'auto' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 'bold' }}>
                  DietInt
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Nutrition & Wellness Center<br />
                  Greater Hyderabad Area<br />
                  Telangana, India
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Consultation Hours:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Monday - Friday: 10:00 AM - 7:00 PM<br />
                    Saturday: 10:00 AM - 5:00 PM<br />
                    Sunday: Closed (Online consultations available)
                  </Typography>
                </Box>
                
                <Button
                  variant="outlined"
                  sx={{ 
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.50' },
                    textTransform: 'none'
                  }}
                >
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}