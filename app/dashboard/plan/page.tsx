'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Card, CardContent, Button, CircularProgress } from '@mui/material';
import Navbar from '@/components/Navbar';

type CurrentPlan = {
  id: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  assigned_at?: string;
} | null;

export default function ClientPlanPage() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<CurrentPlan>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) { router.push('/auth/login'); return; }
        const res = await fetch('/api/plans/current', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setPlan(data.plan || null);
      } catch (_) {
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [router]);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>Your Diet Plan</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : plan ? (
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={700}>{plan.title}</Typography>
              {plan.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>{plan.description}</Typography>
              )}
              <Box sx={{ mt: 2 }}>
                {plan.start_date && (
                  <Typography variant="body2">Start: {new Date(plan.start_date).toLocaleDateString()}</Typography>
                )}
                {plan.end_date && (
                  <Typography variant="body2">End: {new Date(plan.end_date).toLocaleDateString()}</Typography>
                )}
                {plan.assigned_at && (
                  <Typography variant="body2">Assigned: {new Date(plan.assigned_at).toLocaleString()}</Typography>
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6">No active plan yet</Typography>
              <Typography variant="body2" color="text.secondary">Please contact your coach to get a personalized plan assigned.</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={() => router.push('/contact')}>Contact Support</Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}

