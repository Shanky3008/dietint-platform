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
      title: 'Coach Support Hotline',
      details: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91-XXXXXXXXXX',
      subtitle: 'Mon-Fri 9AM-9PM IST'
    },
    {
      icon: <Email sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Coach Support Email',
      details: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'coaches@coachpulse.in',
      subtitle: 'Response within 4 hours'
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Platform Access',
      details: 'Cloud-Based Platform',
      subtitle: 'Available 24/7 from anywhere'
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
                Coach Support Center
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                Need help with your coaching practice? Questions about the platform? Our team is here to support your success.
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
                      Get Coach Support
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
                            label="Support Category"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            select
                            SelectProps={{ native: true }}
                            required
                          >
                            <option value="">Select a category...</option>
                            <option value="platform-help">Platform Help & Training</option>
                            <option value="billing">Billing & Subscription</option>
                            <option value="client-issues">Client Management Issues</option>
                            <option value="white-label">White-Label Branding</option>
                            <option value="technical">Technical Issues</option>
                            <option value="feature-request">Feature Requests</option>
                            <option value="general">General Inquiry</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="How can we help your coaching practice?"
                            name="message"
                            multiline
                            rows={6}
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Describe your question or issue. Include details about your current setup and what you're trying to achieve..."
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
                        Schedule Onboarding
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        New coach? Book a free onboarding session to get started.
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        href="/auth/register"
                        sx={{ textTransform: 'none' }}
                      >
                        Book Onboarding
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Chat sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Coach Knowledge Base
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Find guides, tutorials, and coaching best practices.
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        href="/knowledge-base"
                        sx={{ textTransform: 'none' }}
                      >
                        View Resources
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Office Hours */}
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Support Hours
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Monday - Friday</Typography>
                          <Typography variant="body2">9:00 AM - 9:00 PM IST</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Saturday</Typography>
                          <Typography variant="body2">10:00 AM - 6:00 PM IST</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Sunday</Typography>
                          <Typography variant="body2" color="text.secondary">Emergency Only</Typography>
                        </Box>
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            Priority Support for Pro Coaches
                          </Typography>
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
          Thank you! Your support request has been received. Our coach success team will respond within 4 hours.
        </Alert>
      </Snackbar>
    </Box>
  );
}
