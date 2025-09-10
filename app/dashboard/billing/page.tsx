'use client';

import { useEffect, useState } from 'react';
import { Container, Box, Typography, Card, CardContent, Button, TextField, Grid, CircularProgress } from '@mui/material';
import Navbar from '@/components/Navbar';
import QRCode from 'qrcode';

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);
  const [upi, setUpi] = useState<{vpa:string;name:string;link:string}>({vpa:'',name:'',link:''});
  const [qr, setQr] = useState<string>('');
  const [utr, setUtr] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => { fetchInvoice(); }, []);

  async function fetchInvoice() {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/billing/invoice', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' } : undefined });
      const data = await res.json();
      setInvoice(data.invoice);
      setUpi(data.upi);
      if (data.upi?.link) {
        const url = await QRCode.toDataURL(data.upi.link);
        setQr(url);
      }
    } finally { setLoading(false); }
  }

  async function submitConfirmation() {
    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/billing/confirm', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' } : { 'Content-Type':'application/json' },
        body: JSON.stringify({ invoice_id: invoice.id, utr, proof_url: proofUrl })
      });
      if (!res.ok) throw new Error('failed');
      await fetchInvoice();
      setUtr(''); setProofUrl('');
    } catch { /* ignore */ } finally { setSubmitLoading(false); }
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>Billing</Typography>
        {loading ? (
          <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700}>Current Invoice</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">Period: {invoice?.period}</Typography>
                <Typography variant="body2">Active Clients (snapshot): {invoice?.active_clients_snapshot}</Typography>
                <Typography variant="body2">Amount: ₹{invoice?.amount}</Typography>
                <Typography variant="body2">Reference: {invoice?.ref}</Typography>
                <Typography variant="body2">Status: {invoice?.status}</Typography>
              </Box>
              {upi.link ? (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Scan UPI QR to Pay</Typography>
                    {qr && (<img src={qr} alt="UPI QR" style={{ maxWidth: '100%', border: '1px solid #eee', borderRadius: 8 }} />)}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">UPI Details</Typography>
                    <Typography variant="body2">VPA: {upi.vpa}</Typography>
                    <Typography variant="body2">Name: {upi.name}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Button variant="outlined" size="small" onClick={()=>window.open(upi.link, '_blank')}>Open UPI Link</Button>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">UPI is not configured. Please contact support.</Typography>
                </Box>
              )}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Submit Payment Confirmation</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="UTR" value={utr} onChange={(e)=>setUtr(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Proof URL (optional)" value={proofUrl} onChange={(e)=>setProofUrl(e.target.value)} placeholder="Upload to get a URL" />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" disabled={submitLoading || !utr} onClick={submitConfirmation}>Submit</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}

