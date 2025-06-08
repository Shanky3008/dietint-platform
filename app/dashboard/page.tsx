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
  LinearProgress,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Badge
} from '@mui/material';
import {
  LocalDining,
  Person,
  Analytics,
  Notifications,
  TrendingUp,
  CalendarToday,
  FitnessCenter,
  Favorite,
  Payment,
  Settings,
  Article,
  QuestionAnswer,
  Schedule,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { RootState } from '@/lib/store';
import Navbar from '@/components/Navbar';

// Sample data for charts
const weightProgressData = [
  { month: 'Jan', weight: 75, target: 70 },
  { month: 'Feb', weight: 73, target: 70 },
  { month: 'Mar', weight: 71, target: 70 },
  { month: 'Apr', weight: 69, target: 70 },
  { month: 'May', weight: 68, target: 70 },
];

const nutritionData = [
  { name: 'Protein', value: 25, color: '#4CAF50' },
  { name: 'Carbs', value: 45, color: '#2196F3' },
  { name: 'Fats', value: 30, color: '#FF9800' },
];

const dailyMealsData = [
  { meal: 'Breakfast', calories: 350, target: 400 },
  { meal: 'Lunch', calories: 580, target: 600 },
  { meal: 'Snack', calories: 150, target: 200 },
  { meal: 'Dinner', calories: 420, target: 500 },
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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
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

export default function EnhancedDashboardPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Welcome Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 64, 
                  height: 64, 
                  mr: 3,
                  fontSize: '1.5rem'
                }}
              >
                {user?.fullName?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Welcome back, {user?.fullName || 'User'}! 👋
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Here's your comprehensive nutrition dashboard
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip label={user?.role || 'CLIENT'} color="primary" size="small" />
                  <Chip label="Online" color="success" size="small" />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Alert Notifications */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Alert severity="info" icon={<Schedule />}>
                You have an appointment with Dr. Priya tomorrow at 3:00 PM
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Alert severity="success" icon={<CheckCircle />}>
                Great job! You've completed 80% of your weekly goals
              </Alert>
            </Grid>
          </Grid>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <LocalDining sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Today's Meals</Typography>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>4/4</Typography>
                  <LinearProgress variant="determinate" value={100} sx={{ mt: 1, borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary">All meals completed!</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Analytics sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Calories Today</Typography>
                  <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>1,500</Typography>
                  <LinearProgress variant="determinate" value={75} sx={{ mt: 1, borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary">/ 2,000 goal (75%)</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Person sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Current Weight</Typography>
                  <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>68.5</Typography>
                  <Typography variant="caption" color="success.main">↓ 6.5kg this month</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Weekly Goal</Typography>
                  <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>80%</Typography>
                  <LinearProgress variant="determinate" value={80} sx={{ mt: 1, borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary">Keep it up!</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabbed Content */}
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs" variant="scrollable" scrollButtons="auto">
                <Tab label="Diet Plan" icon={<LocalDining />} />
                <Tab label="Progress" icon={<TrendingUp />} />
                <Tab label="Appointments" icon={<CalendarToday />} />
                <Tab label="Payments" icon={<Payment />} />
                <Tab label="AI Insights" icon={<Analytics />} />
                <Tab label="Settings" icon={<Settings />} />
              </Tabs>
            </Box>

            {/* Diet Plan Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Today's Nutrition Breakdown
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer>
                          <BarChart data={dailyMealsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="meal" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="calories" fill="#4CAF50" />
                            <Bar dataKey="target" fill="#E0E0E0" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Macro Distribution
                      </Typography>
                      <Box sx={{ height: 250 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={nutritionData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            >
                              {nutritionData.map((entry, index) => (
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
            </TabPanel>

            {/* Progress Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Weight Progress Over Time
                      </Typography>
                      <Box sx={{ height: 400 }}>
                        <ResponsiveContainer>
                          <LineChart data={weightProgressData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="weight" stroke="#4CAF50" strokeWidth={3} />
                            <Line type="monotone" dataKey="target" stroke="#FF9800" strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Appointments Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Upcoming Appointments
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarToday color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Follow-up Consultation"
                            secondary="Tomorrow, 3:00 PM with Dr. Priya"
                          />
                          <Chip label="Confirmed" color="success" size="small" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <CalendarToday color="secondary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Progress Review"
                            secondary="Next Friday, 2:00 PM"
                          />
                          <Chip label="Scheduled" color="primary" size="small" />
                        </ListItem>
                      </List>
                      <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                        Book New Appointment
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Recent Consultations
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Initial Consultation"
                            secondary="Last week - Diet plan created"
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Weight Check-in"
                            secondary="2 weeks ago - Great progress!"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Payments Tab */}
            <TabPanel value={tabValue} index={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Payment History
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Payment color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Monthly Consultation Package"
                        secondary="Paid on May 25, 2024"
                      />
                      <Typography variant="h6" color="success.main">₹2,500</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Payment color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Diet Plan Consultation"
                        secondary="Paid on April 20, 2024"
                      />
                      <Typography variant="h6" color="success.main">₹1,500</Typography>
                    </ListItem>
                  </List>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Download Invoice
                  </Button>
                </CardContent>
              </Card>
            </TabPanel>

            {/* AI Insights Tab */}
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        AI Recommendations
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Favorite color="error" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Increase Protein Intake"
                            secondary="Consider adding more lean proteins to reach your muscle-building goals"
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <FitnessCenter color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Add Morning Walk"
                            secondary="A 30-minute walk could help accelerate your weight loss"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Health Insights
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>Weekly Progress Score</Typography>
                        <LinearProgress variant="determinate" value={85} sx={{ height: 10, borderRadius: 1 }} />
                        <Typography variant="caption">85% - Excellent!</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>Goal Achievement</Typography>
                        <LinearProgress variant="determinate" value={70} sx={{ height: 10, borderRadius: 1 }} />
                        <Typography variant="caption">70% - Keep going!</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Profile Settings
                      </Typography>
                      <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                        Edit Profile
                      </Button>
                      <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                        Change Password
                      </Button>
                      <Button variant="outlined" fullWidth>
                        Notification Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Health Goals
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Target Weight"
                            secondary="65 kg"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Daily Calories"
                            secondary="2,000 kcal"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Weekly Goal"
                            secondary="Lose 0.5 kg"
                          />
                        </ListItem>
                      </List>
                      <Button variant="contained" fullWidth>
                        Update Goals
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </>
  );
}