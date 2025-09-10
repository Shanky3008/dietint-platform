'use client';

import { useEffect, useState } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, TextField, Button, CircularProgress } from '@mui/material';
import Navbar from '@/components/Navbar';

export default function AdminUpiPage() {
  const [upiVpa, setUpiVpa] = useState('');
  const [upiName, setUpiName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { (async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/settings/upi', { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const data = await res.json();
      setUpiVpa(data.upi_vpa || '');
      setUpiName(data.upi_name || '');
    } finally { setLoading(false); }
  })(); }, []);

  const save = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await fetch('/api/admin/settings/upi', { method: 'POST', headers: { 'Content-Type':'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ upi_vpa: upiVpa, upi_name: upiName }) });
    } finally { setSaving(false); }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>UPI Settings</Typography>
        {loading ? (
          <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'40vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="UPI VPA" value={upiVpa} onChange={(e)=>setUpiVpa(e.target.value)} placeholder="yourvpa@bank" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Payee Name" value={upiName} onChange={(e)=>setUpiName(e.target.value)} placeholder="CoachPulse Technologies" />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={save} disabled={saving}>Save</Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}

