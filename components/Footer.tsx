'use client';

import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from '@mui/icons-material';
import { BRAND_CONFIG } from '@/lib/branding';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {BRAND_CONFIG.logo.full}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'grey.400' }}>
              {BRAND_CONFIG.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Facebook sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
              <Twitter sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
              <Instagram sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
              <LinkedIn sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Diet Planning
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Weight Management
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                PCOS/PCOD Support
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Diabetes Care
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Online Consultations
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Home
              </Link>
              <Link href="/about" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                About Us
              </Link>
              <Link href="/articles" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Articles
              </Link>
              <Link href="/contact" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Contact
              </Link>
              <Link href="/privacy" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Privacy Policy
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2" color="grey.400">
                  {BRAND_CONFIG.contact.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2" color="grey.400">
                  {BRAND_CONFIG.contact.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2" color="grey.400">
                  {BRAND_CONFIG.contact.address}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'grey.700' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="grey.400">
            © 2024 {BRAND_CONFIG.business.name}. All rights reserved.
          </Typography>
          <Typography variant="body2" color="grey.400">
            Made with ❤️ for better health
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}