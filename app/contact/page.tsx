'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn, 
  Send,
  Schedule,
  Chat
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Phone sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone',
      details: '+91 99999 88888',
      subtitle: 'Mon-Fri 10AM-7PM IST'
    },
    {
      icon: <Email sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      details: 'gouri@nutriconnect.com',
      subtitle: 'We reply within 24 hours'
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Office',
      details: 'Greater Hyderabad Area',
      subtitle: 'In-person & online consultations'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Header Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fff7ed 100%)',
          py: { xs: 8, md: 12 }
        }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Get in Touch
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                Have questions about nutrition? Ready to start your health journey? We're here to help!
              </Typography>
            </Box>
          </Container>
        </Box>
        
        {/* Contact Info Cards */}
        <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        boxShadow: 4,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ mb: 2 }}>
                        {info.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {info.title}
                      </Typography>
                      <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {info.details}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.subtitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Contact Form */}
            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                      Send us a Message
                    </Typography>
                    
                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Message"
                            name="message"
                            multiline
                            rows={6}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            startIcon={<Send />}
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
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Quick Actions */}
                  <Card>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Schedule sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Book Consultation
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Ready to start? Book a consultation with our nutrition expert.
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        href="/auth/register"
                        sx={{ textTransform: 'none' }}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Chat sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        FAQ
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Find answers to commonly asked questions.
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        href="/faq"
                        sx={{ textTransform: 'none' }}
                      >
                        View FAQ
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Office Hours */}
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Office Hours
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Monday - Friday</Typography>
                          <Typography variant="body2">10:00 AM - 7:00 PM</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Saturday</Typography>
                          <Typography variant="body2">10:00 AM - 5:00 PM</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Sunday</Typography>
                          <Typography variant="body2" color="text.secondary">Online Only</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      
      <Footer />
      
      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Thank you! Your message has been sent successfully. We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Box>
  );
}