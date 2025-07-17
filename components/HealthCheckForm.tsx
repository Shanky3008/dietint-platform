'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Checkbox,
  FormGroup,
  Alert,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FitnessCenter,
  LocalDining,
  Bed,
  Mood,
  WaterDrop,
  DirectionsRun,
  Info,
  TrendingUp,
  Warning,
  CheckCircle,
  Save,
  History,
  Analytics,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface HealthCheckData {
  date: string;
  weight: number;
  energyLevel: number;
  sleepQuality: number;
  stressLevel: number;
  waterIntake: number;
  mealsSatisfaction: number;
  exerciseMinutes: number;
  symptoms: string[];
  notes: string;
  mood: 'excellent' | 'good' | 'fair' | 'poor';
  digestion: 'excellent' | 'good' | 'fair' | 'poor';
  cravings: boolean;
  medicationTaken: boolean;
}

interface HealthCheckFormProps {
  onSubmit?: (data: HealthCheckData) => void;
  onClose?: () => void;
  previousData?: HealthCheckData;
}

const HealthCheckForm: React.FC<HealthCheckFormProps> = ({
  onSubmit,
  onClose,
  previousData
}) => {
  const [formData, setFormData] = useState<HealthCheckData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: previousData?.weight || 0,
    energyLevel: previousData?.energyLevel || 5,
    sleepQuality: previousData?.sleepQuality || 5,
    stressLevel: previousData?.stressLevel || 5,
    waterIntake: previousData?.waterIntake || 8,
    mealsSatisfaction: previousData?.mealsSatisfaction || 5,
    exerciseMinutes: previousData?.exerciseMinutes || 0,
    symptoms: previousData?.symptoms || [],
    notes: previousData?.notes || '',
    mood: previousData?.mood || 'good',
    digestion: previousData?.digestion || 'good',
    cravings: previousData?.cravings || false,
    medicationTaken: previousData?.medicationTaken || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const availableSymptoms = [
    'Headache',
    'Fatigue',
    'Bloating',
    'Nausea',
    'Heartburn',
    'Constipation',
    'Diarrhea',
    'Joint Pain',
    'Muscle Soreness',
    'Dizziness',
    'Skin Issues',
    'Mood Swings',
    'Food Cravings',
    'Sleep Issues',
    'Anxiety',
    'Brain Fog'
  ];

  const handleSliderChange = (field: keyof HealthCheckData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit?.(formData);
      
      // Reset form for next day
      setFormData(prev => ({
        ...prev,
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        symptoms: [],
        cravings: false,
        medicationTaken: false
      }));
      
    } catch (error) {
      console.error('Failed to submit health check:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWellnessScore = () => {
    const scores = [
      formData.energyLevel,
      formData.sleepQuality,
      (10 - formData.stressLevel), // Inverse stress level
      formData.mealsSatisfaction,
      Math.min(formData.waterIntake, 10), // Cap at 10
      Math.min(formData.exerciseMinutes / 10, 10), // 10 minutes = 1 point
    ];
    
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(averageScore * 10); // Convert to percentage
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! You\'re doing great today.';
    if (score >= 60) return 'Good! A few areas could use attention.';
    return 'Consider focusing on self-care today.';
  };

  const wellnessScore = getWellnessScore();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <FitnessCenter />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Daily Health Check-In
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setShowHistory(true)}>
              <History />
            </IconButton>
            <IconButton onClick={() => setShowTips(true)}>
              <Info />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Wellness Score */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Today's Wellness Score
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getScoreMessage(wellnessScore)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ minWidth: 100 }}>
                <LinearProgress
                  variant="determinate"
                  value={wellnessScore}
                  color={getScoreColor(wellnessScore) as any}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Chip
                label={`${wellnessScore}%`}
                color={getScoreColor(wellnessScore) as any}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Physical Metrics */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FitnessCenter sx={{ mr: 1 }} />
              Physical Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
              inputProps={{ min: 0, max: 300, step: 0.1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Exercise Minutes"
              type="number"
              value={formData.exerciseMinutes}
              onChange={(e) => setFormData(prev => ({ ...prev, exerciseMinutes: parseInt(e.target.value) || 0 }))}
              inputProps={{ min: 0, max: 600 }}
            />
          </Grid>

          {/* Energy & Sleep */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Bed sx={{ mr: 1 }} />
              Energy & Sleep
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Energy Level</FormLabel>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.energyLevel}
                  onChange={(_, value) => handleSliderChange('energyLevel', value as number)}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Sleep Quality</FormLabel>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.sleepQuality}
                  onChange={(_, value) => handleSliderChange('sleepQuality', value as number)}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>
            </FormControl>
          </Grid>

          {/* Nutrition & Hydration */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <LocalDining sx={{ mr: 1 }} />
              Nutrition & Hydration
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Water Intake (glasses)</FormLabel>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.waterIntake}
                  onChange={(_, value) => handleSliderChange('waterIntake', value as number)}
                  step={1}
                  marks
                  min={0}
                  max={15}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Meals Satisfaction</FormLabel>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.mealsSatisfaction}
                  onChange={(_, value) => handleSliderChange('mealsSatisfaction', value as number)}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>
            </FormControl>
          </Grid>

          {/* Mental Wellbeing */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Mood sx={{ mr: 1 }} />
              Mental Wellbeing
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel>Overall Mood</FormLabel>
              <RadioGroup
                value={formData.mood}
                onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value as any }))}
              >
                <FormControlLabel value="excellent" control={<Radio />} label="Excellent" />
                <FormControlLabel value="good" control={<Radio />} label="Good" />
                <FormControlLabel value="fair" control={<Radio />} label="Fair" />
                <FormControlLabel value="poor" control={<Radio />} label="Poor" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Stress Level</FormLabel>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.stressLevel}
                  onChange={(_, value) => handleSliderChange('stressLevel', value as number)}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  color="error"
                />
              </Box>
            </FormControl>
          </Grid>

          {/* Digestion */}
          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel>Digestion</FormLabel>
              <RadioGroup
                value={formData.digestion}
                onChange={(e) => setFormData(prev => ({ ...prev, digestion: e.target.value as any }))}
              >
                <FormControlLabel value="excellent" control={<Radio />} label="Excellent" />
                <FormControlLabel value="good" control={<Radio />} label="Good" />
                <FormControlLabel value="fair" control={<Radio />} label="Fair" />
                <FormControlLabel value="poor" control={<Radio />} label="Poor" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.cravings}
                    onChange={(e) => setFormData(prev => ({ ...prev, cravings: e.target.checked }))}
                  />
                }
                label="Experienced food cravings"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.medicationTaken}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicationTaken: e.target.checked }))}
                  />
                }
                label="Took prescribed medications"
              />
            </FormGroup>
          </Grid>

          {/* Symptoms */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Any Symptoms Today?
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableSymptoms.map((symptom) => (
                <Chip
                  key={symptom}
                  label={symptom}
                  clickable
                  color={formData.symptoms.includes(symptom) ? 'primary' : 'default'}
                  onClick={() => handleSymptomToggle(symptom)}
                  variant={formData.symptoms.includes(symptom) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Notes"
              placeholder="How are you feeling today? Any specific concerns or victories?"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Alert severity="info" sx={{ flexGrow: 1, mr: 2 }}>
                <Typography variant="body2">
                  Daily check-ins help track your progress and identify patterns in your health journey.
                </Typography>
              </Alert>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {onClose && (
                  <Button onClick={onClose} variant="outlined">
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  variant="contained"
                  startIcon={isSubmitting ? <LinearProgress /> : <Save />}
                  sx={{ minWidth: 120 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Check-In'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* History Dialog */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>Check-In History</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Your previous health check-ins will appear here once you start tracking regularly.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Analytics />
            <Typography variant="body2">
              Coming soon: Detailed analytics and trend tracking
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Tips Dialog */}
      <Dialog open={showTips} onClose={() => setShowTips(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Health Check-In Tips</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Consistency is key:</strong> Fill out your check-in at the same time each day for best results.
              </Typography>
            </Alert>
            <Alert severity="success">
              <Typography variant="body2">
                <strong>Be honest:</strong> Accurate data helps Gouri provide better recommendations.
              </Typography>
            </Alert>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Track patterns:</strong> Notice trends in your energy, sleep, and symptoms over time.
              </Typography>
            </Alert>
            <Alert severity="error">
              <Typography variant="body2">
                <strong>Emergency symptoms:</strong> Contact your healthcare provider immediately for severe symptoms.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTips(false)}>Got it</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthCheckForm;