'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Menu,
  MenuItem,
  Badge,
  LinearProgress,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
} from '@mui/material';
import {
  CameraAlt,
  PhotoLibrary,
  Add,
  Delete,
  Edit,
  Fastfood,
  Analytics,
  Restaurant,
  Schedule,
  Favorite,
  Info,
  CheckCircle,
  Warning,
  Close,
  Save,
  Share,
  Search,
  TrendingUp,
  PhotoCamera,
  Image,
  CloudUpload,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  confidence: number;
}

interface FoodLogEntry {
  id: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  imageUrl: string;
  foods: FoodItem[];
  notes: string;
  portion: 'small' | 'medium' | 'large';
  satisfaction: number;
  totalCalories: number;
  isAnalyzed: boolean;
  aiAnalysis?: {
    detectedFoods: string[];
    nutritionEstimate: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    healthScore: number;
    recommendations: string[];
  };
}

interface PhotoFoodLogProps {
  onSave?: (entry: FoodLogEntry) => void;
  onClose?: () => void;
}

const PhotoFoodLog: React.FC<PhotoFoodLogProps> = ({ onSave, onClose }) => {
  const [entries, setEntries] = useState<FoodLogEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<FoodLogEntry>>({
    mealType: 'lunch',
    notes: '',
    portion: 'medium',
    satisfaction: 7,
    foods: [],
    isAnalyzed: false,
  });
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' },
  ];

  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create image URL
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    // Start AI analysis
    setAnalyzing(true);
    await simulateAIAnalysis(imageUrl);
  };

  const simulateAIAnalysis = async (imageUrl: string) => {
    // Simulate AI food recognition and nutrition analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockAnalysis = {
      detectedFoods: ['Rice', 'Dal', 'Curry', 'Vegetables', 'Chapati'],
      nutritionEstimate: {
        calories: 450,
        protein: 15,
        carbs: 65,
        fat: 12,
      },
      healthScore: 85,
      recommendations: [
        'Great balanced meal with good protein and fiber',
        'Consider adding more vegetables for extra vitamins',
        'Perfect portion size for lunch',
      ],
    };

    setCurrentEntry(prev => ({
      ...prev,
      imageUrl,
      aiAnalysis: mockAnalysis,
      isAnalyzed: true,
      totalCalories: mockAnalysis.nutritionEstimate.calories,
    }));

    setAnalyzing(false);
    setShowAnalysis(true);
  };

  const handleSaveEntry = () => {
    if (!currentEntry.imageUrl || !currentEntry.mealType) return;

    const newEntry: FoodLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      mealType: currentEntry.mealType,
      imageUrl: currentEntry.imageUrl,
      foods: currentEntry.foods || [],
      notes: currentEntry.notes || '',
      portion: currentEntry.portion || 'medium',
      satisfaction: currentEntry.satisfaction || 7,
      totalCalories: currentEntry.totalCalories || 0,
      isAnalyzed: currentEntry.isAnalyzed || false,
      aiAnalysis: currentEntry.aiAnalysis,
    };

    setEntries(prev => [...prev, newEntry]);
    onSave?.(newEntry);

    // Reset form
    setCurrentEntry({
      mealType: 'lunch',
      notes: '',
      portion: 'medium',
      satisfaction: 7,
      foods: [],
      isAnalyzed: false,
    });
    setSelectedImage(null);
    setShowAnalysis(false);
  };

  const getTotalNutrition = () => {
    return entries.reduce(
      (total, entry) => ({
        calories: total.calories + entry.totalCalories,
        protein: total.protein + (entry.aiAnalysis?.nutritionEstimate.protein || 0),
        carbs: total.carbs + (entry.aiAnalysis?.nutritionEstimate.carbs || 0),
        fat: total.fat + (entry.aiAnalysis?.nutritionEstimate.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const getHealthScore = () => {
    if (entries.length === 0) return 0;
    return Math.round(
      entries.reduce((sum, entry) => sum + (entry.aiAnalysis?.healthScore || 70), 0) / entries.length
    );
  };

  const totalNutrition = getTotalNutrition();
  const healthScore = getHealthScore();

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <PhotoCamera />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Photo Food Log
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Analytics />}
              onClick={() => setShowNutritionDetails(true)}
            >
              Analytics
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outlined">
                Close
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Daily Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {totalNutrition.calories}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {Math.round(totalNutrition.protein)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Protein
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {Math.round(totalNutrition.carbs)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Carbs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">
                {Math.round(totalNutrition.fat)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fat
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add New Entry */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Add sx={{ mr: 1 }} />
          Log New Meal
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Meal Type</FormLabel>
              <RadioGroup
                row
                value={currentEntry.mealType}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, mealType: e.target.value as any }))}
              >
                {mealTypes.map((meal) => (
                  <FormControlLabel
                    key={meal.value}
                    value={meal.value}
                    control={<Radio />}
                    label={`${meal.icon} ${meal.label}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                style={{ display: 'none' }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageCapture}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="contained"
                startIcon={<CameraAlt />}
                onClick={() => cameraInputRef.current?.click()}
                disabled={analyzing}
              >
                Take Photo
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PhotoLibrary />}
                onClick={() => fileInputRef.current?.click()}
                disabled={analyzing}
              >
                Upload Photo
              </Button>
            </Box>
          </Grid>

          {selectedImage && (
            <Grid item xs={12}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={selectedImage}
                  alt="Food photo"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  {analyzing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={24} />
                      <Typography>Analyzing food...</Typography>
                    </Box>
                  ) : currentEntry.aiAnalysis ? (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        AI Analysis Results
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {currentEntry.aiAnalysis.detectedFoods.map((food, index) => (
                          <Chip key={index} label={food} variant="outlined" size="small" />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Estimated: {currentEntry.aiAnalysis.nutritionEstimate.calories} calories
                      </Typography>
                      <Chip
                        label={`Health Score: ${currentEntry.aiAnalysis.healthScore}%`}
                        color={currentEntry.aiAnalysis.healthScore >= 80 ? 'success' : 'warning'}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  ) : null}
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Portion Size</FormLabel>
              <RadioGroup
                row
                value={currentEntry.portion}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, portion: e.target.value as any }))}
              >
                <FormControlLabel value="small" control={<Radio />} label="Small" />
                <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                <FormControlLabel value="large" control={<Radio />} label="Large" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Satisfaction (1-10)</FormLabel>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={currentEntry.satisfaction}
                  onChange={(_, value) => setCurrentEntry(prev => ({ ...prev, satisfaction: value as number }))}
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notes"
              placeholder="How did this meal make you feel? Any observations?"
              value={currentEntry.notes}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveEntry}
              disabled={!selectedImage || analyzing}
              sx={{ mr: 1 }}
            >
              Save Entry
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedImage(null);
                setCurrentEntry({
                  mealType: 'lunch',
                  notes: '',
                  portion: 'medium',
                  satisfaction: 7,
                  foods: [],
                  isAnalyzed: false,
                });
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Today's Entries */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Restaurant sx={{ mr: 1 }} />
          Today's Meals ({entries.length})
        </Typography>
        
        {entries.length === 0 ? (
          <Alert severity="info">
            No meals logged yet today. Start by taking a photo of your meal!
          </Alert>
        ) : (
          <List>
            {entries.map((entry) => (
              <ListItem key={entry.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 2 }}>
                <ListItemAvatar>
                  <Avatar
                    src={entry.imageUrl}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
                      </Typography>
                      <Chip
                        label={`${entry.totalCalories} cal`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {entry.aiAnalysis && (
                        <Chip
                          label={`${entry.aiAnalysis.healthScore}% healthy`}
                          size="small"
                          color={entry.aiAnalysis.healthScore >= 80 ? 'success' : 'warning'}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(entry.timestamp, 'h:mm a')} • {entry.portion} portion
                      </Typography>
                      {entry.aiAnalysis && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {entry.aiAnalysis.detectedFoods.slice(0, 3).map((food, index) => (
                            <Chip key={index} label={food} size="small" variant="outlined" />
                          ))}
                          {entry.aiAnalysis.detectedFoods.length > 3 && (
                            <Chip label={`+${entry.aiAnalysis.detectedFoods.length - 3} more`} size="small" />
                          )}
                        </Box>
                      )}
                      {entry.notes && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          "{entry.notes}"
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <IconButton>
                  <Edit />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* AI Analysis Dialog */}
      <Dialog open={showAnalysis} onClose={() => setShowAnalysis(false)} maxWidth="md" fullWidth>
        <DialogTitle>AI Food Analysis</DialogTitle>
        <DialogContent>
          {currentEntry.aiAnalysis && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Detected Foods
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {currentEntry.aiAnalysis.detectedFoods.map((food, index) => (
                  <Chip key={index} label={food} color="primary" />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Nutrition Estimate
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{currentEntry.aiAnalysis.nutritionEstimate.calories}</Typography>
                      <Typography variant="body2" color="text.secondary">Calories</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{currentEntry.aiAnalysis.nutritionEstimate.protein}g</Typography>
                      <Typography variant="body2" color="text.secondary">Protein</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{currentEntry.aiAnalysis.nutritionEstimate.carbs}g</Typography>
                      <Typography variant="body2" color="text.secondary">Carbs</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{currentEntry.aiAnalysis.nutritionEstimate.fat}g</Typography>
                      <Typography variant="body2" color="text.secondary">Fat</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Health Recommendations
              </Typography>
              <List>
                {currentEntry.aiAnalysis.recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalysis(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Nutrition Details Dialog */}
      <Dialog open={showNutritionDetails} onClose={() => setShowNutritionDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>Daily Nutrition Analytics</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Health Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={healthScore}
                sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                color={healthScore >= 80 ? 'success' : 'warning'}
              />
              <Typography variant="h6">{healthScore}%</Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Nutrition Breakdown
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Based on AI analysis of your logged meals. Values are estimates.
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Daily Calories</Typography>
              <Typography variant="h6">{totalNutrition.calories}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Protein</Typography>
              <Typography variant="h6">{Math.round(totalNutrition.protein)}g</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Carbohydrates</Typography>
              <Typography variant="h6">{Math.round(totalNutrition.carbs)}g</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Fat</Typography>
              <Typography variant="h6">{Math.round(totalNutrition.fat)}g</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNutritionDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhotoFoodLog;