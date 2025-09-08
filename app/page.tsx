'use client';

import React, { useState, useEffect } from 'react';
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
  Chip,
  LinearProgress,
  Fade,
  Slide,
  Grow,
  Zoom,
  Paper,
  Stack,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  TrendingUp,
  Psychology,
  Palette,
  Speed,
  Timeline,
  Groups,
  PlayArrow,
  CheckCircle,
  NotificationImportant,
  SmartToy,
  Security,
  MonetizationOn,
  Star,
  LocalFireDepartment,
  Smartphone,
  ArrowForward,
  Analytics,
  AutoAwesome
} from '@mui/icons-material';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ServicesSection from '@/components/ServicesSection';

export default function HomePage() {
  const [animateStats, setAnimateStats] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    coaches: 0,
    clients: 0,
    revenue: 0,
    retention: 0
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStats(true);
      animateNumbers();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const animateNumbers = () => {
    const targets = {
      coaches: 500,
      clients: 10000,
      revenue: 2000000,
      retention: 98
    };

    Object.keys(targets).forEach((key) => {
      let current = 0;
      const target = targets[key];
      const increment = target / 100;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.round(current)
        }));
      }, 20);
    });
  };

  const premiumFeatures = [
    {
      icon: <NotificationImportant sx={{ fontSize: 50, color: '#FF6B6B' }} />,
      title: 'Smart Alert System',
      subtitle: 'Never Miss a Critical Moment',
      description: 'AI-powered notifications that tell you exactly when clients need attention. "Priya hasn\'t logged lunch today" - actionable, instant, intelligent.',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
      stats: '99.9% accuracy'
    },
    {
      icon: <Psychology sx={{ fontSize: 50, color: '#4ECDC4' }} />,
      title: 'Ghost Prevention AI',
      subtitle: 'Save Revenue Before It Walks Away',
      description: 'Advanced behavioral analysis predicts when clients are about to go silent. Intervene early, retain more clients, protect your revenue.',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #6ED4D2 100%)',
      stats: '25% better retention'
    },
    {
      icon: <SmartToy sx={{ fontSize: 50, color: '#A8E6CF' }} />,
      title: 'Intelligent Nudges',
      subtitle: 'Automation That Feels Human',
      description: 'Send personalized reminders that scale effortlessly. Smart timing, contextual messaging, maximum engagement without the manual work.',
      gradient: 'linear-gradient(135deg, #A8E6CF 0%, #C4FFCB 100%)',
      stats: '3x engagement rate'
    },
    {
      icon: <Palette sx={{ fontSize: 50, color: '#FFB6C1' }} />,
      title: 'White-Label Excellence',
      subtitle: 'Your Brand, Professional Image',
      description: 'Complete customization with your colors, logo, and domain. Clients experience YOUR professional coaching brand, not a generic platform.',
      gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FFC6D2 100%)',
      stats: '100% customizable'
    }
  ];

  const coachTypes = [
    {
      emoji: '🥗',
      title: 'Nutrition Coaches',
      description: 'Track meal compliance, manage diet plans, monitor progress with precision',
      color: '#4CAF50'
    },
    {
      emoji: '💪',
      title: 'Fitness Coaches',
      description: 'Assign workouts, track completion, monitor fitness goals seamlessly',
      color: '#FF9800'
    },
    {
      emoji: '🧘',
      title: 'Wellness Coaches',
      description: 'Guide lifestyle changes, track habits, support mental wellness journeys',
      color: '#9C27B0'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Coach Onboarding',
      description: 'Sign up, customize your branding, set your coaching parameters. Takes 5 minutes.',
      icon: <AutoAwesome sx={{ fontSize: 40, color: '#667eea' }} />
    },
    {
      step: 2,
      title: 'Generate Invite Codes',
      description: 'Create unique codes for your clients. Complete control over who joins your practice.',
      icon: <Security sx={{ fontSize: 40, color: '#667eea' }} />
    },
    {
      step: 3,
      title: 'Client Integration',
      description: 'Clients download the app, enter your code, automatically linked to your brand.',
      icon: <Groups sx={{ fontSize: 40, color: '#667eea' }} />
    },
    {
      step: 4,
      title: 'Intelligent Management',
      description: 'Smart alerts, automated nudges, progress tracking. All powered by AI.',
      icon: <Analytics sx={{ fontSize: 40, color: '#667eea' }} />
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Premium Hero Section */}
        <HeroSection />

        {/* Premium Stats Bar */}
        <Box sx={{ 
          py: 6, 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {[
                { label: 'Active Coaches', value: animatedValues.coaches, suffix: '+', icon: <Groups />, color: '#4CAF50' },
                { label: 'Clients Managed', value: (animatedValues.clients / 1000).toFixed(0), suffix: 'K+', icon: <Timeline />, color: '#2196F3' },
                { label: 'Revenue Generated', value: `₹${(animatedValues.revenue / 100000).toFixed(0)}L`, suffix: '+', icon: <MonetizationOn />, color: '#FF9800' },
                { label: 'Satisfaction Rate', value: animatedValues.retention, suffix: '%', icon: <Star />, color: '#E91E63' }
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Zoom in={animateStats} timeout={1000 + index * 200}>
                    <Paper sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 4,
                      background: 'linear-gradient(145deg, #fff 0%, #fafbff 100%)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }
                    }}>
                      <Box sx={{ 
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: `${stat.color}20`,
                        mb: 2
                      }}>
                        {React.cloneElement(stat.icon, { 
                          sx: { fontSize: 32, color: stat.color } 
                        })}
                      </Box>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 900,
                          color: stat.color,
                          mb: 1,
                          fontSize: { xs: '1.8rem', md: '2.5rem' }
                        }}
                      >
                        {stat.value}{stat.suffix}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Coach Types Section */}
        <Box sx={{ py: 10, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Fade in={true} timeout={1200}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography 
                  variant="h2" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Built for Every Coach
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    maxWidth: '600px', 
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  Whether you specialize in nutrition, fitness, or wellness, CoachPulse adapts to your coaching style
                </Typography>
              </Box>
            </Fade>
            
            <Grid container spacing={4}>
              {coachTypes.map((type, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Grow in={true} timeout={1000 + index * 200}>
                    <Card sx={{
                      height: '100%',
                      borderRadius: 4,
                      background: 'linear-gradient(145deg, #fff 0%, #fafbff 100%)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-16px) scale(1.02)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                      }
                    }}>
                      <Box
                        sx={{
                          height: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `linear-gradient(135deg, ${type.color} 0%, ${type.color}CC 100%)`,
                          color: 'white',
                          fontSize: '3rem',
                          borderRadius: '16px 16px 0 0'
                        }}
                      >
                        {type.emoji}
                      </Box>
                      
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, mb: 2 }}>
                          {type.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {type.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Premium Features Section */}
        <Box sx={{ py: 12, background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{ 
                textAlign: 'center',
                fontWeight: 800,
                mb: 8,
                color: 'text.primary'
              }}
            >
              Intelligence Meets Excellence
            </Typography>
            
            <Grid container spacing={6}>
              {premiumFeatures.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Slide in={true} direction={index % 2 === 0 ? 'right' : 'left'} timeout={1000 + index * 300}>
                    <Card sx={{
                      height: '100%',
                      borderRadius: 6,
                      background: 'linear-gradient(145deg, #fff 0%, #fafbff 100%)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-20px) scale(1.03)',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.2)',
                      }
                    }}>
                      <Box
                        sx={{
                          height: 140,
                          background: feature.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        {feature.icon}
                        <Chip
                          label={feature.stats}
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 800,
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                      </Box>
                      
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: 'primary.main', 
                            fontWeight: 600,
                            mb: 2
                          }}
                        >
                          {feature.subtitle}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.8,
                            color: 'text.secondary',
                            mb: 3
                          }}
                        >
                          {feature.description}
                        </Typography>
                        
                        <Button
                          variant="contained"
                          endIcon={<ArrowForward />}
                          sx={{
                            background: feature.gradient,
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 3,
                            boxShadow: 'none',
                            '&:hover': {
                              background: feature.gradient,
                              transform: 'translateY(-2px)',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }
                          }}
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How It Works - Premium Process */}
        <Box sx={{ py: 12, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{ 
                textAlign: 'center',
                fontWeight: 800,
                mb: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Your Journey to Excellence
            </Typography>
            
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              {howItWorks.map((step, index) => (
                <Fade in={true} timeout={1000 + index * 300} key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 6,
                    position: 'relative'
                  }}>
                    {/* Step number and line */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      mr: 4,
                      minWidth: 80
                    }}>
                      <Paper sx={{ 
                        width: 80,
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
                        zIndex: 2
                      }}>
                        {step.icon}
                      </Paper>
                      {index < howItWorks.length - 1 && (
                        <Box sx={{
                          width: 2,
                          height: 60,
                          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                          mt: 2,
                          borderRadius: 1
                        }} />
                      )}
                    </Box>
                    
                    <Card sx={{ 
                      flexGrow: 1,
                      borderRadius: 4,
                      background: 'linear-gradient(145deg, #fff 0%, #f8f9ff 100%)',
                      border: '1px solid rgba(102,126,234,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: '0 12px 40px rgba(102,126,234,0.15)'
                      }
                    }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip 
                            label={`Step ${step.step}`} 
                            color="primary" 
                            size="small"
                            sx={{ mr: 2, fontWeight: 700 }}
                          />
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {step.title}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {step.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Fade>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Use existing components for testimonials and services */}
        <TestimonialsSection />
        
        {/* Premium CTA Section */}
        <Box sx={{ 
          py: 15,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 30s infinite linear'
          }} />
          
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ mb: 4 }}>
              <LocalFireDepartment sx={{ fontSize: 80, opacity: 0.9, mb: 2 }} />
            </Box>
            
            <Typography 
              variant="h1" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: '3rem', md: '4.5rem' },
                background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Ready to Revolutionize Your Practice?
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 6, 
                opacity: 0.9,
                lineHeight: 1.6,
                fontWeight: 300,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Join 500+ coaches who've transformed their business with CoachPulse. Your first 5 clients are completely free.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/auth/register"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 8,
                  py: 2.5,
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
                  }
                }}
              >
                Start Your Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
                component={Link}
                href="/mobile"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 8,
                  py: 2.5,
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 4,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                See Demo
              </Button>
            </Stack>
            
            <Typography variant="body1" sx={{ opacity: 0.8, fontSize: '1.1rem' }}>
              No setup fees • Cancel anytime • First 5 clients free forever
            </Typography>
          </Container>
        </Box>
      </Box>
      
      <Footer />

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Box>
  );
}
