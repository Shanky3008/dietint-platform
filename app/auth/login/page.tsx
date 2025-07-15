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
  CardContent
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginSuccess } from '@/lib/features/auth/authSlice';
import Navbar from '@/components/Navbar';
import { LoginOutlined, PersonAdd } from '@mui/icons-material';

const schema = yup.object({
  username: yup.string().required('Username or email is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error messages from backend
        let errorMessage = 'Login failed';
        if (result.error) {
          errorMessage = result.error;
        } else if (result.message) {
          errorMessage = result.message;
        } else if (response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        throw new Error(errorMessage);
      }

      // Store token and user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      // Update Redux state
      dispatch(loginSuccess({
        user: result.user,
        token: result.token,
      }));

      // Redirect based on role
      const redirectPath = result.user.role === 'ADMIN' 
        ? '/admin/dashboard'
        : result.user.role === 'DIETITIAN'
        ? '/dietitian/dashboard'
        : '/dashboard';

      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
        <Container component="main" maxWidth="sm">
          <Card elevation={8} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <LoginOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Sign in to your NutriConnect account
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  {...register('username')}
                  margin="normal"
                  required
                  fullWidth
                  label="Username or Email"
                  autoComplete="username"
                  autoFocus
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  sx={{ mb: 2 }}
                />
                <TextField
                  {...register('password')}
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ 
                    mt: 2, 
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Don't have an account?
                  </Typography>
                  <Button
                    component={Link}
                    href="/auth/register"
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<PersonAdd />}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      textTransform: 'none'
                    }}
                  >
                    Create New Account
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Demo Credentials:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Dietitian: <strong>dr.priya</strong> | Password: <strong>dietitian123</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Client: <strong>rahul.kumar</strong> | Password: <strong>client123</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}