'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Payment,
  Download,
  Receipt,
  Search,
  FilterList,
  DateRange,
  AttachMoney,
  TrendingUp,
  History,
  Email
} from '@mui/icons-material';
import { RootState } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { BRAND_CONFIG } from '@/lib/branding';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  transaction_id: string;
  service_name: string;
  payment_date: string;
  created_at: string;
  invoice_url?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PaymentsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [stats, setStats] = useState({
    total_spent: 0,
    total_payments: 0,
    pending_amount: 0,
    last_payment_date: null
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchPayments();
  }, [isAuthenticated, router]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (paymentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/${paymentId}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `invoice-${paymentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download invoice:', error);
    }
  };

  const emailInvoice = async (paymentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/${paymentId}/email-invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Invoice sent to your email address!');
      }
    } catch (error) {
      console.error('Failed to email invoice:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={60} />
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Payment sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                Payment History
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Track your payments and download invoices
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Payment Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Spent</Typography>
                <Typography variant="h4" sx={{ color: 'success.main' }}>
                  ${stats.total_spent.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Receipt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Payments</Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  {stats.total_payments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Pending</Typography>
                <Typography variant="h4" sx={{ color: 'warning.main' }}>
                  ${stats.pending_amount.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <History sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Last Payment</Typography>
                <Typography variant="body1" sx={{ color: 'info.main' }}>
                  {stats.last_payment_date ? 
                    new Date(stats.last_payment_date).toLocaleDateString() : 
                    'No payments yet'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="All Payments" icon={<Receipt />} />
              <Tab label="Invoices" icon={<Download />} />
            </Tabs>
          </Box>

          {/* All Payments Tab */}
          <TabPanel value={tabValue} index={0}>
            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ minWidth: 150 }}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </TextField>
            </Box>

            {filteredPayments.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                {payments.length === 0 ? 
                  'No payments found. Start your nutrition journey today!' :
                  'No payments match your search criteria.'
                }
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment ID</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          #{payment.id}
                        </TableCell>
                        <TableCell>{payment.service_name || 'NutriWise Service'}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {payment.currency} ${payment.amount}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.payment_method || 'Online'} 
                            variant="outlined" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.status} 
                            color={getStatusColor(payment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => downloadInvoice(payment.id)}
                              title="Download Invoice"
                            >
                              <Download />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => emailInvoice(payment.id)}
                              title="Email Invoice"
                            >
                              <Email />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Invoices Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {filteredPayments
                .filter(p => p.status === 'completed')
                .map((payment) => (
                <Grid item xs={12} sm={6} md={4} key={payment.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">Invoice #{payment.id}</Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {payment.service_name || 'NutriWise Service'}
                      </Typography>
                      
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {payment.currency} ${payment.amount}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Date: {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Download />}
                          onClick={() => downloadInvoice(payment.id)}
                          fullWidth
                        >
                          Download PDF
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Email />}
                          onClick={() => emailInvoice(payment.id)}
                        >
                          Email
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {filteredPayments.filter(p => p.status === 'completed').length === 0 && (
              <Alert severity="info">
                No completed payments found. Invoices are available after successful payments.
              </Alert>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </>
  );
}