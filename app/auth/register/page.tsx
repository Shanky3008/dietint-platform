'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginSuccess } from '@/lib/features/auth/authSlice';
import Navbar from '@/components/Navbar';
import { PersonAdd, Login } from '@mui/icons-material';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  fullName: yup.string().required('Full name is required'),
});

type RegisterFormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', result.token);
      }

      // Update Redux state
      dispatch(loginSuccess({
        user: result.user,
        token: result.token,
      }));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}>
        <Container component="main" maxWidth="md">
          <Card elevation={8} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Join CoachPulse
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Start your health transformation journey today
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      {...register('fullName')}
                      required
                      fullWidth
                      label="Full Name"
                      autoComplete="name"
                      autoFocus
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register('email')}
                      required
                      fullWidth
                      label="Email Address"
                      type="email"
                      autoComplete="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register('password')}
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      autoComplete="new-password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  </Grid>
                </Grid>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ 
                    mt: 3, 
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
                
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Already have an account?
                  </Typography>
                  <Button
                    component={Link}
                    href="/auth/login"
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<Login />}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      textTransform: 'none'
                    }}
                  >
                    Sign In to Existing Account
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
