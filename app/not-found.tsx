'use client';

import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={900} gutterBottom>Page Not Found</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          The page you are looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" component={Link} href="/">Go Home</Button>
          <Button variant="outlined" component={Link} href="/contact">Contact Support</Button>
        </Box>
      </Container>
    </>
  );
}

