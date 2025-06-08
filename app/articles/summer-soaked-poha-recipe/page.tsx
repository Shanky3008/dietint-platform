'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Chip, 
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Step,
  Stepper,
  StepLabel,
  StepContent
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime,
  Share,
  Bookmark,
  CheckCircle,
  Timer,
  Group,
  Restaurant
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SummerSoakedPohaRecipePage() {
  const recipeSteps = [
    {
      label: 'Prepare the Poha',
      description: 'Soak 1 cup poha in water for 2-3 minutes until soft, then drain thoroughly to remove excess water.'
    },
    {
      label: 'Mix with Curd',
      description: 'Add 1/2 cup fresh curd to the drained poha and let it rest for 5 minutes to absorb flavors.'
    },
    {
      label: 'Add Fresh Vegetables',
      description: 'Mix in chopped cucumber, tomato, onion, green chili, and grated ginger for freshness and crunch.'
    },
    {
      label: 'Season and Garnish',
      description: 'Add salt, cumin seeds, fresh coriander leaves, and a squeeze of lemon juice. Serve chilled.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="md">
          {/* Article Header */}
          <Box sx={{ mb: 4 }}>
            <Chip 
              label="Seasonal Recipes" 
              color="primary" 
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              lineHeight: 1.2,
              mb: 3
            }}>
              Summer Delight: Soaked Poha with Curd and Vegetables
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ 
              mb: 4,
              lineHeight: 1.6
            }}>
              A perfect summer delight that's both nutritious and refreshing, combining probiotics from curd with seasonal vegetables and light, digestible poha.
            </Typography>
            
            {/* Recipe Info Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Timer color="primary" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Prep Time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    10 minutes
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Group color="primary" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Serves
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    2-3 people
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Restaurant color="primary" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Meal Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Breakfast/Snack
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <CheckCircle color="success" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Difficulty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Easy
                  </Typography>
                </Card>
              </Grid>
            </Grid>
            
            {/* Author and Date Info */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              mb: 4,
              pb: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                  GPM
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Gouri Priya Mylavarapu
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    MSc Nutrition | 11+ Years Experience
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    June 8, 2025
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    4 min read
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<Share />}>
                  Share
                </Button>
                <Button size="small" startIcon={<Bookmark />}>
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
          
          {/* Recipe Content */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Introduction */}
              <Typography variant="body1" paragraph sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.7,
                mb: 3,
                fontWeight: 'medium'
              }}>
                Soaked Poha with curd and vegetables makes for a perfect summer delight that's both nutritious and refreshing. This recipe combines the lightness of poha with probiotic benefits of curd and seasonal vegetables, embodying our AT-HOME foods philosophy perfectly.
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Ingredients */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Ingredients
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Main Ingredients
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1 cup poha (flattened rice)" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1/2 cup fresh curd (yogurt)" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1/4 cup cucumber, finely chopped" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1/4 cup tomato, finely chopped" />
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Seasonings & Garnish
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="2 tbsp onion, finely chopped" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1 green chili, finely chopped" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1 tbsp grated ginger" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Salt to taste, cumin seeds, coriander" />
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Step-by-Step Instructions */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Step-by-Step Instructions
              </Typography>
              
              <Stepper orientation="vertical" sx={{ mb: 4 }}>
                {recipeSteps.map((step, index) => (
                  <Step key={index} active completed>
                    <StepLabel>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              
              {/* Nutritional Benefits */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Nutritional Benefits
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'success.50', p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Probiotic Benefits
                    </Typography>
                    <Typography variant="body2">
                      Fresh curd provides beneficial bacteria for digestive health, supporting gut microbiome and improving nutrient absorption.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'primary.50', p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      High Fiber Content
                    </Typography>
                    <Typography variant="body2">
                      Vegetables provide essential fiber for digestive health, helping maintain stable blood sugar levels and promoting satiety.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'info.50', p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Light & Digestible
                    </Typography>
                    <Typography variant="body2">
                      Perfect for summer when appetite is low, providing easy-to-digest nutrition without overwhelming the system.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'warning.50', p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Hydrating Properties
                    </Typography>
                    <Typography variant="body2">
                      Curd and fresh vegetables provide hydration support during hot weather, helping maintain fluid balance.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Seasonal Appropriateness */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Why Perfect for Summer?
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                  This recipe embodies the principles of seasonal eating that I've advocated throughout my 11+ years of nutrition practice. Summer requires foods that cool the body, provide hydration, and are easy to digest when heat reduces appetite.
                </Typography>
                
                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Cooling properties:</strong> Curd naturally cools the body temperature
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Hydration support:</strong> High water content from vegetables and curd
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Easy digestion:</strong> Light meal when appetite is naturally reduced
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Quick energy:</strong> Poha provides instant energy without heaviness
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {/* Expert Tips */}
              <Card sx={{ bgcolor: 'primary.50', p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Expert Tips from Gouri Priya
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
                  • Choose thick, fresh curd for better probiotic content and taste<br />
                  • Don't over-soak the poha - it should be soft but not mushy<br />
                  • Add vegetables just before serving to maintain crunch and freshness<br />
                  • Serve chilled for maximum summer refreshment<br />
                  • Perfect as a post-workout meal when combined with a protein source
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  - Based on 11+ years of nutrition experience
                </Typography>
              </Card>
              
              {/* AT-HOME Foods Philosophy */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                AT-HOME Foods Approach
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                This recipe perfectly demonstrates our AT-HOME foods philosophy. Every ingredient - poha, curd, vegetables, and spices - is readily available in any Indian kitchen. No special diet products or expensive supplements required.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                This aligns with our research-based approach of using everyday ingredients for extraordinary health benefits, making nutritious eating accessible and sustainable for everyone.
              </Typography>
              
              {/* Call to Action */}
              <Box sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: 'grey.50', 
                borderRadius: 2,
                textAlign: 'center'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Want More Seasonal Healthy Recipes?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get personalized meal plans with seasonal recipes tailored to your health goals
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link}
                  href="/auth/register"
                  sx={{ px: 4 }}
                >
                  Get Your Meal Plan
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          {/* Related Articles */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Related Articles
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Amla Chutney Benefits
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Vitamin C powerhouse for immunity and health
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Virgin Coconut Oil Benefits
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Discover the power of wood-pressed coconut oil for health
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Understanding Milk in Diet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Learn about this versatile ingredient and allergy considerations
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
}