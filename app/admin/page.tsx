'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Avatar,
  Chip,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Dashboard,
  People,
  CalendarToday,
  Payment,
  Analytics,
  Settings,
  Search,
  Edit,
  Delete,
  Visibility,
  Add,
  TrendingUp,
  AttachMoney,
  PersonAdd,
  EventNote,
  Shield,
  Article,
  QuestionAnswer,
  FilterList,
  ContentPaste
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { RootState } from '@/lib/store';
import Navbar from '@/components/Navbar';

// Sample data for charts
const monthlyRevenue = [
  { month: 'Jan', revenue: 45000, users: 120 },
  { month: 'Feb', revenue: 52000, users: 135 },
  { month: 'Mar', revenue: 48000, users: 128 },
  { month: 'Apr', revenue: 61000, users: 165 },
  { month: 'May', revenue: 55000, users: 142 },
  { month: 'Jun', revenue: 67000, users: 178 },
];

const serviceData = [
  { name: 'Diet Consultation', value: 35, color: '#4CAF50' },
  { name: 'Weight Management', value: 25, color: '#2196F3' },
  { name: 'PCOS/PCOD', value: 20, color: '#FF9800' },
  { name: 'Diabetes Management', value: 15, color: '#F44336' },
  { name: 'General Wellness', value: 5, color: '#9C27B0' },
];

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'];

// Sample data for tables
const sampleUsers = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'client',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-05-30'
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    role: 'client',
    status: 'active',
    joinDate: '2024-02-20',
    lastLogin: '2024-05-29'
  },
  {
    id: 3,
    fullName: 'Gouri Priya Mylavarapu',
    email: 'admin@dietint.com',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-01',
    lastLogin: '2024-05-30'
  }
];

const sampleAppointments = [
  {
    id: 1,
    clientName: 'John Doe',
    serviceType: 'Diet Consultation',
    date: '2024-06-01',
    time: '10:00 AM',
    status: 'confirmed',
    type: 'online'
  },
  {
    id: 2,
    clientName: 'Jane Smith',
    serviceType: 'Weight Management',
    date: '2024-06-02',
    time: '2:00 PM',
    status: 'pending',
    type: 'in-person'
  },
  {
    id: 3,
    clientName: 'Mike Johnson',
    serviceType: 'PCOS Consultation',
    date: '2024-06-03',
    time: '11:00 AM',
    status: 'completed',
    type: 'online'
  }
];

const samplePayments = [
  {
    id: 'TXN001',
    clientName: 'John Doe',
    service: 'Diet Consultation',
    amount: 2500,
    status: 'completed',
    date: '2024-05-30'
  },
  {
    id: 'TXN002',
    clientName: 'Jane Smith',
    service: 'Weight Management',
    amount: 3500,
    status: 'completed',
    date: '2024-05-29'
  },
  {
    id: 'TXN003',
    clientName: 'Mike Johnson',
    service: 'PCOS Consultation',
    amount: 3000,
    status: 'pending',
    date: '2024-05-28'
  }
];

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [content, setContent] = useState<any>({});
  const [contentLoading, setContentLoading] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
    }
    
    // Check if user is admin (dietitian)
    if (user && user.role !== 'dietitian') {
      router.push('/dashboard');
      return;
    }
    
    setIsLoading(false);
  }, [isAuthenticated, user, router]);

  // Fetch content for content management
  const fetchContent = async () => {
    setContentLoading(true);
    try {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      const response = await fetch('/api/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || {});
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  // Update content
  const updateContent = async (section: string, key: string, value: string) => {
    try {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/content/${section}/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value })
      });
      
      if (response.ok) {
        setSuccessMessage('Content updated successfully!');
        fetchContent();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  useEffect(() => {
    if (tabValue === 5) { // Content Management tab
      fetchContent();
    }
  }, [tabValue]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress size={60} />
        </Box>
      </>
    );
  }

  // Redirect non-admin users
  if (user?.role !== 'dietitian') {
    return (
      <>
        <Navbar />
        <Container sx={{ py: 4 }}>
          <Alert severity="error">
            Access denied. This page is only available to administrators.
          </Alert>
        </Container>
      </>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate statistics
  const totalUsers = sampleUsers.length;
  const totalAppointments = sampleAppointments.length;
  const totalRevenue = samplePayments.reduce((sum, payment) => sum + payment.amount, 0);
  const activeUsers = sampleUsers.filter(u => u.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Shield sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  DietInt Management Portal
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip label="Administrator" color="primary" size="small" />
                  <Chip label="Full Access" color="success" size="small" />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Users</Typography>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{totalUsers}</Typography>
                  <Typography variant="caption" color="success.main">↑ +12% this month</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CalendarToday sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Appointments</Typography>
                  <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>{totalAppointments}</Typography>
                  <Typography variant="caption" color="success.main">↑ +8% this month</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AttachMoney sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Revenue</Typography>
                  <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>₹{totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="caption" color="success.main">↑ +20% this month</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Active Users</Typography>
                  <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>{activeUsers}</Typography>
                  <Typography variant="caption" color="success.main">↑ +5% this month</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Revenue & User Growth
                  </Typography>
                  <Box sx={{ height: 350 }}>
                    <ResponsiveContainer>
                      <AreaChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value, name) => [
                          name === 'revenue' ? `₹${value}` : value,
                          name === 'revenue' ? 'Revenue' : 'Users'
                        ]} />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" stackId="1" stroke="#4CAF50" fill="#4CAF50" />
                        <Line yAxisId="right" type="monotone" dataKey="users" stroke="#2196F3" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Service Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabbed Content */}
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs" variant="scrollable" scrollButtons="auto">
                <Tab label="Overview" icon={<Dashboard />} />
                <Tab label="Users" icon={<People />} />
                <Tab label="Appointments" icon={<CalendarToday />} />
                <Tab label="Payments" icon={<Payment />} />
                <Tab label="Analytics" icon={<Analytics />} />
                <Tab label="Content" icon={<ContentPaste />} />
              </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button variant="contained" startIcon={<PersonAdd />}>
                        Add New User
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" startIcon={<EventNote />}>
                        Manage Appointments
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" startIcon={<Article />}>
                        Manage Articles
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" startIcon={<QuestionAnswer />}>
                        Manage Q&A
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Users Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
                <Box>
                  <IconButton>
                    <FilterList />
                  </IconButton>
                  <Button variant="contained" startIcon={<Add />} sx={{ ml: 1 }}>
                    Add User
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Join Date</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sampleUsers
                      .filter(user => 
                        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {user.fullName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {user.fullName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={user.role === 'admin' ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status} 
                            color={getStatusColor(user.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Appointments Tab */}
            <TabPanel value={tabValue} index={2}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Client</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sampleAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.clientName}</TableCell>
                        <TableCell>
                          <Chip label={appointment.serviceType} variant="outlined" size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{appointment.date}</Typography>
                          <Typography variant="caption" color="text.secondary">{appointment.time}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={appointment.status} 
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={appointment.type} 
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Payments Tab */}
            <TabPanel value={tabValue} index={3}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {samplePayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          {payment.id}
                        </TableCell>
                        <TableCell>{payment.clientName}</TableCell>
                        <TableCell>
                          <Chip label={payment.service} variant="outlined" size="small" />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          ₹{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.status} 
                            color={getStatusColor(payment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{payment.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Analytics Tab */}
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Service Popularity
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer>
                          <BarChart data={serviceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4CAF50" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Monthly Trends
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer>
                          <LineChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={3} />
                            <Line type="monotone" dataKey="users" stroke="#2196F3" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Content Management Tab */}
            <TabPanel value={tabValue} index={5}>
              {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {successMessage}
                </Alert>
              )}
              
              {contentLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Hero Section Content */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Hero Section
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Hero Title"
                              fullWidth
                              multiline
                              rows={2}
                              value={content.hero?.title?.value || ''}
                              onChange={(e) => updateContent('hero', 'title', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Hero Subtitle"
                              fullWidth
                              multiline
                              rows={2}
                              value={content.hero?.subtitle?.value || ''}
                              onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Hero Description"
                              fullWidth
                              multiline
                              rows={3}
                              value={content.hero?.description?.value || ''}
                              onChange={(e) => updateContent('hero', 'description', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Primary CTA Button"
                              fullWidth
                              value={content.hero?.cta_primary?.value || ''}
                              onChange={(e) => updateContent('hero', 'cta_primary', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Secondary CTA Button"
                              fullWidth
                              value={content.hero?.cta_secondary?.value || ''}
                              onChange={(e) => updateContent('hero', 'cta_secondary', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Branding Section */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Branding
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="App Name"
                              fullWidth
                              value={content.branding?.app_name?.value || ''}
                              onChange={(e) => updateContent('branding', 'app_name', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="Tagline"
                              fullWidth
                              value={content.branding?.tagline?.value || ''}
                              onChange={(e) => updateContent('branding', 'tagline', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="Description"
                              fullWidth
                              value={content.branding?.description?.value || ''}
                              onChange={(e) => updateContent('branding', 'description', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Features Section */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Features Section
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Features Title"
                              fullWidth
                              value={content.features?.title?.value || ''}
                              onChange={(e) => updateContent('features', 'title', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Features Subtitle"
                              fullWidth
                              value={content.features?.subtitle?.value || ''}
                              onChange={(e) => updateContent('features', 'subtitle', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                        
                        {/* Feature Cards */}
                        {[1, 2, 3, 4].map(num => (
                          <Box key={num} sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              Feature {num}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={2}>
                                <TextField
                                  label="Icon (emoji)"
                                  fullWidth
                                  value={content[`feature_${num}`]?.icon?.value || ''}
                                  onChange={(e) => updateContent(`feature_${num}`, 'icon', e.target.value)}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  label="Title"
                                  fullWidth
                                  value={content[`feature_${num}`]?.title?.value || ''}
                                  onChange={(e) => updateContent(`feature_${num}`, 'title', e.target.value)}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  label="Description"
                                  fullWidth
                                  multiline
                                  rows={2}
                                  value={content[`feature_${num}`]?.description?.value || ''}
                                  onChange={(e) => updateContent(`feature_${num}`, 'description', e.target.value)}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Contact Information */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Contact Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Email"
                              fullWidth
                              type="email"
                              value={content.contact?.email?.value || ''}
                              onChange={(e) => updateContent('contact', 'email', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Phone"
                              fullWidth
                              value={content.contact?.phone?.value || ''}
                              onChange={(e) => updateContent('contact', 'phone', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Address"
                              fullWidth
                              value={content.contact?.address?.value || ''}
                              onChange={(e) => updateContent('contact', 'address', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Business Hours"
                              fullWidth
                              value={content.contact?.hours?.value || ''}
                              onChange={(e) => updateContent('contact', 'hours', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Footer Information */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Footer Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="Copyright Text"
                              fullWidth
                              value={content.footer?.copyright?.value || ''}
                              onChange={(e) => updateContent('footer', 'copyright', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="Business Name"
                              fullWidth
                              value={content.footer?.business_name?.value || ''}
                              onChange={(e) => updateContent('footer', 'business_name', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="Description"
                              fullWidth
                              value={content.footer?.description?.value || ''}
                              onChange={(e) => updateContent('footer', 'description', e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </>
  );
}