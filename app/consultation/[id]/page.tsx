'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  VideoCall,
  Message,
  Schedule,
  Person,
  Info,
  Warning,
} from '@mui/icons-material';
import MessagingInterface from '@/components/MessagingInterface';

// Mock data - in production, this would come from your backend
const mockConsultationData = {
  id: 'consultation_123',
  clientId: 'client_456',
  clientName: 'Rahul Kumar',
  nutritionistId: 'nutritionist_789',
  nutritionistName: 'Gouri Priya Mylavarapu',
  status: 'active',
  scheduledTime: new Date('2024-01-20T14:00:00'),
  duration: 60,
  type: 'follow-up',
  notes: 'Follow-up consultation for weight management program',
  previousConsultations: 3,
  currentGoals: [
    'Lose 5kg in 3 months',
    'Improve digestion',
    'Increase energy levels'
  ]
};

const ConsultationPage: React.FC = () => {
  const params = useParams();
  const consultationId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [consultationData, setConsultationData] = useState(mockConsultationData);
  const [currentUser, setCurrentUser] = useState({
    id: 'client_456',
    name: 'Rahul Kumar',
    role: 'client' as 'client' | 'nutritionist'
  });
  const [showMessaging, setShowMessaging] = useState(false);

  useEffect(() => {
    // Simulate loading consultation data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [consultationId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const isClient = currentUser.role === 'client';
  const isNutritionist = currentUser.role === 'nutritionist';
  const recipientId = isClient ? consultationData.nutritionistId : consultationData.clientId;
  const recipientName = isClient ? consultationData.nutritionistName : consultationData.clientName;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'scheduled':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (showMessaging) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MessagingInterface
          userId={currentUser.id}
          userName={currentUser.name}
          userRole={currentUser.role}
          consultationId={consultationId}
          recipientId={recipientId}
          recipientName={recipientName}
          onClose={() => setShowMessaging(false)}
        />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Consultation with {recipientName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip
                  label={consultationData.status}
                  color={getStatusColor(consultationData.status) as any}
                  size="small"
                />
                <Chip
                  label={consultationData.type}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Message />}
              onClick={() => setShowMessaging(true)}
              sx={{ mr: 1 }}
            >
              Start Messaging
            </Button>
            <Button
              variant="outlined"
              startIcon={<VideoCall />}
              color="primary"
            >
              Video Call
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Scheduled Time
              </Typography>
            </Box>
            <Typography variant="body1">
              {consultationData.scheduledTime.toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Duration
              </Typography>
            </Box>
            <Typography variant="body1">
              {consultationData.duration} minutes
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Consultation Details */}
      <Grid container spacing={3}>
        {/* Client Goals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Goals
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {consultationData.currentGoals.map((goal, index) => (
                  <Chip
                    key={index}
                    label={goal}
                    variant="outlined"
                    size="small"
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Consultation Notes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {consultationData.notes}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Previous consultations: {consultationData.previousConsultations}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Disclaimer */}
        <Grid item xs={12}>
          <Alert severity="info" icon={<Warning />}>
            <Typography variant="body2">
              <strong>Professional Consultation:</strong> This is a professional nutrition consultation with 
              Gouri Priya Mylavarapu (MSc Nutrition, 15+ years experience). All advice provided is based on 
              professional expertise and should be followed as part of a comprehensive health plan. 
              For medical emergencies, please contact your healthcare provider immediately.
            </Typography>
          </Alert>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowMessaging(true)}
                >
                  Send Message
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                >
                  Share Food Log
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                >
                  Schedule Follow-up
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                >
                  View Diet Plan
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                >
                  Progress Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ConsultationPage;