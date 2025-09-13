'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import Navbar from '@/components/Navbar';

type Plan = {
  id: number;
  code: string;
  name: string;
  price_inr: number;
  billing_period: string;
  pricing_model: 'per_client' | 'flat' | string;
  features?: any;
  limits?: any;
};

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/plans');
        const data = await res.json();
        setPlans(data.plans || []);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          const sres = await fetch('/api/billing/subscription', { headers: { Authorization: `Bearer ${token}` } });
          const sdata = await sres.json();
          setSub(sdata.subscription || null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const choosePlan = async (planCode: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan_code: planCode })
      });
      if (!res.ok) throw new Error('failed');
      router.push('/dashboard/billing');
    } catch {
      router.push('/auth/login');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 6, background: 'linear-gradient(135deg, #f0f9ff 0%, #fff7ed 100%)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, textAlign: 'center' }}>Simple, Transparent Pricing</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 5 }}>
            Pay only for what you use. Switch plans anytime.
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} md={4} key={plan.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{plan.name}</Typography>
                        {sub?.plan_id === plan.id && (
                          <Chip size="small" color="success" label="Current" />
                        )}
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>
                        ₹{plan.price_inr}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        {plan.pricing_model === 'flat' ? 'per month (flat)' : 'per client/month'}
                      </Typography>

                      {plan.limits && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {typeof plan.limits === 'string' ? plan.limits : JSON.stringify(plan.limits)}
                        </Typography>
                      )}

                      <Button variant="contained" fullWidth onClick={() => choosePlan(plan.code)}>
                        {sub?.plan_id === plan.id ? 'Manage in Billing' : 'Choose Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Need help picking a plan? <Link href="/contact">Contact support</Link>.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

