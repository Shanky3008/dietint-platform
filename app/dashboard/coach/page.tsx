'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Grid, Card, CardContent, Chip, LinearProgress, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import { RootState } from '@/lib/store';
import Navbar from '@/components/Navbar';

type RiskBand = 'green' | 'yellow' | 'red';

interface RiskClient {
  client_id: number;
  name: string;
  last_activity: string | null;
  risk: RiskBand;
}

export default function CoachDashboardPage() {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<RiskClient[]>([]);
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<RiskClient | null>(null);
  const [nudgeText, setNudgeText] = useState('Hi! Quick check-in – how is your plan going today?');
  const [planId, setPlanId] = useState('');
  const [plans, setPlans] = useState<Array<{id:number; title:string}>>([]);
  const [toast, setToast] = useState<{open: boolean; message: string; severity: 'success'|'error'}>({open:false,message:'',severity:'success'});
  const [alerts, setAlerts] = useState<Array<{type:string;priority:'low'|'medium'|'high';client_id:number;client_name:string;message:string}>>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchRisk();
  }, [isAuthenticated]);

  async function fetchRisk() {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/intelligence/risk', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      setClients(data.clients || []);
      // Fetch alerts
      const ares = await fetch('/api/intelligence/alerts', { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const adata = await ares.json();
      setAlerts(adata.alerts || []);
      // Fetch coach plans for picker
      const pres = await fetch('/api/plans/list', { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const pdata = await pres.json();
      setPlans((pdata.plans || []).map((p:any)=>({ id: p.id, title: p.title })));
    } finally {
      setLoading(false);
    }
  }

  const counts = clients.reduce(
    (acc, c) => {
      acc[c.risk] += 1;
      return acc;
    },
    { green: 0, yellow: 0, red: 0 } as Record<RiskBand, number>
  );

  const topAtRisk = clients.filter(c => c.risk === 'red').slice(0, 5);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800}>Coach Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">Triage clients and act before they ghost.</Typography>
        </Box>

        <Grid container spacing={3}>
          {([
            { label: 'Green (Active)', value: counts.green, color: 'success.main' },
            { label: 'Yellow (Watch)', value: counts.yellow, color: 'warning.main' },
            { label: 'Red (At Risk)', value: counts.red, color: 'error.main' },
          ] as const).map((card, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">Status</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: card.color }}>{card.label}</Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ color: card.color }}>{card.value}</Typography>
                  <LinearProgress variant="determinate" value={Math.min(100, (card.value / Math.max(1, clients.length)) * 100)} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={700}>Top At-Risk Clients</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button onClick={async ()=>{
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch('/api/intelligence/nudge-all-red', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : undefined });
                      if (!res.ok) throw new Error('Failed');
                      const d = await res.json();
                      setToast({open:true,severity:'success',message:`Nudged ${d.sent} red clients`});
                    } catch { setToast({open:true,severity:'error',message:'Failed to nudge all red'}); }
                  }} size="small" variant="outlined">Nudge All Red</Button>
                  <Button onClick={fetchRisk} size="small">Refresh</Button>
                </Box>
              </Box>
              <List>
                {topAtRisk.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No red-risk clients right now.</Typography>
                )}
                {topAtRisk.map((c) => (
                  <ListItem key={c.client_id} 
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip color="error" label="Red" size="small" />
                        <Button size="small" variant="outlined" onClick={() => { setActiveClient(c); setNudgeOpen(true); }}>Nudge</Button>
                        <Button size="small" variant="text" onClick={() => { setActiveClient(c); setAssignOpen(true); }}>Assign Plan</Button>
                      </Box>
                    }>
                    <ListItemText 
                      primary={c.name}
                      secondary={c.last_activity ? `Last activity: ${new Date(c.last_activity).toLocaleString()}` : 'No activity yet'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700}>Suggested Actions</Typography>
              <List>
                {alerts.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No suggestions at the moment.</Typography>
                )}
                {alerts.map((a, i) => (
                  <ListItem key={i} secondaryAction={<Chip size="small" label={a.priority.toUpperCase()} color={a.priority==='high'?'error':a.priority==='medium'?'warning':'default'} /> }>
                    <ListItemText primary={a.message} secondary={a.type === 'nudge' ? 'Suggested: send a friendly nudge' : a.type} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Nudge Dialog */}
      <Dialog open={nudgeOpen} onClose={() => setNudgeOpen(false)}>
        <DialogTitle>Send Nudge {activeClient ? `to ${activeClient.name}` : ''}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {[
              'Hi! Quick check-in — how is your plan going today?',
              'Great job so far! Remember to log your lunch today.',
              'I’m here if you need help choosing meals today.',
              'Let’s get back on track. You’ve got this! 💪'
            ].map((tpl, i) => (
              <Button key={i} size="small" variant="outlined" onClick={()=>setNudgeText(tpl)}>Template {i+1}</Button>
            ))}
          </Box>
          <TextField fullWidth multiline minRows={3} value={nudgeText} onChange={(e)=>setNudgeText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setNudgeOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={async ()=>{
            try {
              const token = localStorage.getItem('token');
              const res = await fetch('/api/whatsapp/nudge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ client_id: activeClient?.client_id, text: nudgeText })
              });
              if (!res.ok) throw new Error('Failed');
              setToast({open:true,message:'Nudge sent',severity:'success'});
              setNudgeOpen(false);
            } catch { setToast({open:true,message:'Failed to send nudge',severity:'error'}); }
          }}>Send</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Plan Dialog */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)}>
        <DialogTitle>Assign Plan {activeClient ? `to ${activeClient.name}` : ''}</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="Select Plan" SelectProps={{ native: true }} value={planId} onChange={(e)=>setPlanId(e.target.value)}>
            <option value="">Select a plan...</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setAssignOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={async ()=>{
            try {
              const token = localStorage.getItem('token');
              const res = await fetch('/api/plans/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ client_id: activeClient?.client_id, plan_id: Number(planId) })
              });
              if (!res.ok) throw new Error('Failed');
              setToast({open:true,message:'Plan assigned',severity:'success'});
              setAssignOpen(false);
              setPlanId('');
            } catch { setToast({open:true,message:'Failed to assign plan',severity:'error'}); }
          }}>Assign</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={()=>setToast({...toast, open:false})}>
        <Alert onClose={()=>setToast({...toast, open:false})} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
