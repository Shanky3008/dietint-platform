'use client';

import { useEffect, useState } from 'react';
import { Container, Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Link as MLink, CircularProgress } from '@mui/material';
import Navbar from '@/components/Navbar';

type Invoice = {
  id: number;
  coach_id: number;
  period: string;
  amount: number;
  active_clients_snapshot: number;
  ref: string;
  status: 'due' | 'submitted' | 'paid';
  utr?: string | null;
  proof_url?: string | null;
  coach_name?: string;
  coach_email?: string;
};

export default function AdminBillingPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/billing/invoices', { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const data = await res.json();
      setInvoices(data.invoices || []);
    } finally { setLoading(false); }
  }

  async function verify(id: number) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    await fetch('/api/billing/verify', { method: 'POST', headers: { 'Content-Type':'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ invoice_id: id }) });
    await load();
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={800}>Admin Billing</Typography>
          <Button variant="outlined" onClick={load}>Refresh</Button>
        </Box>
        {loading ? (
          <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Coach</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Ref</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>UTR</TableCell>
                    <TableCell>Proof</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{inv.coach_name || inv.coach_id}</Typography>
                          <Typography variant="caption" color="text.secondary">{inv.coach_email}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{inv.period}</TableCell>
                      <TableCell>{inv.active_clients_snapshot}</TableCell>
                      <TableCell>₹{inv.amount}</TableCell>
                      <TableCell>{inv.ref}</TableCell>
                      <TableCell>
                        <Chip size="small" label={inv.status.toUpperCase()} color={inv.status==='paid'?'success':inv.status==='submitted'?'warning':'default'} />
                      </TableCell>
                      <TableCell>{inv.utr || '-'}</TableCell>
                      <TableCell>
                        {inv.proof_url ? (
                          <MLink href={inv.proof_url} target="_blank" rel="noreferrer">View</MLink>
                        ) : '-' }
                      </TableCell>
                      <TableCell align="right">
                        {inv.status !== 'paid' && (
                          <Button size="small" variant="contained" onClick={()=>verify(inv.id)}>Mark Paid</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}

