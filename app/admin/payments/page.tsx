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
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Alert,
  Button,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import {
  Payment,
  AttachMoney,
  TrendingUp,
  Assessment,
  CalendarMonth,
  Search,
  FileDownload,
  Visibility
} from '@mui/icons-material';
import { RootState } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { BRAND_CONFIG } from '@/lib/branding';

interface PaymentReport {
  id: string;
  user_name: string;
  user_email: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  service_name: string;
  payment_date: string;
  appointment_date?: string;
  commission?: number;
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
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPaymentsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_payments: 0,
    pending_amount: 0,
    commission_earned: 0,
    avg_payment: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    // Check if user is admin/dietitian
    if (user?.role !== 'admin' && user?.role !== 'dietitian') {
      router.push('/dashboard');
      return;
    }
    fetchPaymentReports();
  }, [isAuthenticated, router, user]);

  const fetchPaymentReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/payments/reports?range=${dateRange}`, {
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
      console.error('Failed to fetch payment reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReports = async (format: 'csv' | 'pdf') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/payments/export?format=${format}&range=${dateRange}`, {
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
        a.download = `payment-reports-${dateRange}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export reports:', error);
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
    const matchesSearch = payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.service_name.toLowerCase().includes(searchTerm.toLowerCase());
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assessment sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  Payment Reports
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Revenue analytics and payment management
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => {
                    setDateRange(e.target.value);
                    fetchPaymentReports();
                  }}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={() => exportReports('csv')}
              >
                Export CSV
              </Button>
              
              <Button
                variant="contained"
                startIcon={<FileDownload />}
                onClick={() => exportReports('pdf')}
              >
                Export PDF
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Revenue Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Revenue</Typography>
                <Typography variant="h4" sx={{ color: 'success.main' }}>
                  ${stats.total_revenue.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Payment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Payments</Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  {stats.total_payments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
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
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarMonth sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Avg Payment</Typography>
                <Typography variant="h4" sx={{ color: 'info.main' }}>
                  ${stats.avg_payment.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Commission</Typography>
                <Typography variant="h4" sx={{ color: 'secondary.main' }}>
                  ${stats.commission_earned.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Reports Table */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="All Payments" icon={<Payment />} />
              <Tab label="Recent Activity" icon={<TrendingUp />} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 3, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search clients or services..."
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
              <Alert severity="info" sx={{ m: 3 }}>
                No payment records found for the selected criteria.
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Client</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Appointment</TableCell>
                      <TableCell>Commission</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{payment.user_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {payment.user_email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{payment.service_name}</TableCell>
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
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {payment.appointment_date ? (
                            <Typography variant="caption">
                              {new Date(payment.appointment_date).toLocaleDateString()}
                            </Typography>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              No appointment
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          ${payment.commission?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Recent Payment Activity</Typography>
              {filteredPayments
                .slice(0, 10)
                .map((payment) => (
                  <Card key={payment.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {payment.user_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {payment.service_name} • {new Date(payment.payment_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ color: 'success.main' }}>
                            ${payment.amount}
                          </Typography>
                          <Chip 
                            label={payment.status} 
                            color={getStatusColor(payment.status)}
                            size="small"
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </>
  );
}