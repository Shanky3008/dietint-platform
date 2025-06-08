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
  Restaurant,
  LocalDining,
  Security
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AmlaVitaminCPowerhousePage() {
  const recipeSteps = [
    {
      label: 'Clean and Prepare Amla',
      description: 'Clean 4-5 fresh amla thoroughly and chop them, removing seeds carefully to avoid bitterness.'
    },
    {
      label: 'Prepare the Base',
      description: 'Grind together chopped amla, 2 tbsp fresh grated coconut, 2 green chilies, and 1-inch piece of ginger.'
    },
    {
      label: 'Season for Taste',
      description: 'Add salt to taste and 1 tsp jaggery (optional) for balance. Grind to desired consistency.'
    },
    {
      label: 'Prepare Tempering',
      description: 'Heat 1 tbsp oil, add mustard seeds and curry leaves. Pour over chutney and mix well. Store refrigerated.'
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
              label="Immunity Boosting" 
              color="primary" 
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              lineHeight: 1.2,
              mb: 3
            }}>
              Amla Chutney: The Ultimate Vitamin C Powerhouse for Immunity
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ 
              mb: 4,
              lineHeight: 1.6
            }}>
              Discover why amla chutney is vitamin C rich with antioxidant properties and immunity boosting benefits, making it an excellent addition to daily meals.
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
                    15 minutes
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
                    4-6 people
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <LocalDining color="primary" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Side Dish/Chutney
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Security color="success" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Health Benefit
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Immunity Boost
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
                    6 min read
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
          
          {/* Article Content */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Introduction */}
              <Typography variant="body1" paragraph sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.7,
                mb: 3,
                fontWeight: 'medium'
              }}>
                Amla chutney is vitamin C rich with antioxidant properties and immunity boosting benefits, making it an excellent addition to daily meals. In my 11+ years of nutrition practice, I've consistently recommended amla as one of the most powerful natural immunity builders available in Indian kitchens.
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Why Amla is a Nutritional Powerhouse */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Why Amla is a Nutritional Powerhouse
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'success.50', p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Highest Vitamin C Content
                    </Typography>
                    <Typography variant="body2">
                      Amla contains 20 times more Vitamin C than oranges, making it one of the richest natural sources available.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'primary.50', p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Powerful Antioxidants
                    </Typography>
                    <Typography variant="body2">
                      Rich in polyphenols and flavonoids that fight free radicals and protect against cellular damage.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'warning.50', p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Natural Immunity Builder
                    </Typography>
                    <Typography variant="body2">
                      Enhances immune system function naturally, helping the body defend against infections and illnesses.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'info.50', p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Digestive Support
                    </Typography>
                    <Typography variant="body2">
                      Contains natural enzymes that aid digestion and improve nutrient absorption when consumed with meals.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Ingredients */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Ingredients for Fresh Amla Chutney
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
                        <ListItemText primary="4-5 fresh amla (Indian gooseberries)" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="2 tbsp fresh coconut, grated" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="2 green chilies" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1 inch piece of ginger" />
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Seasonings & Tempering
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Salt to taste" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1 tsp jaggery (optional)" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Few curry leaves" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1 tsp mustard seeds" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="1 tbsp oil for tempering" />
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Step-by-Step Instructions */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Step-by-Step Preparation
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
              
              {/* Health Benefits Deep Dive */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Comprehensive Health Benefits
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  1. Immunity Enhancement
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
                  The extremely high vitamin C content in amla makes it a natural immune system booster. Regular consumption helps the body produce white blood cells more effectively, improving the body's ability to fight off infections and diseases.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  2. Iron Absorption Support
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
                  Vitamin C significantly enhances iron absorption from plant-based sources. This makes amla chutney particularly beneficial when consumed with iron-rich meals like dal, leafy greens, or legumes.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  3. Skin Health and Anti-Aging
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
                  The antioxidants in amla help combat free radical damage, promoting healthy skin from within. Regular consumption can improve skin texture, reduce signs of aging, and promote a natural glow.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  4. Natural Detoxification
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
                  Amla supports the liver's natural detoxification processes, helping the body eliminate toxins more efficiently and supporting overall metabolic health.
                </Typography>
              </Box>
              
              {/* Serving Suggestions */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                How to Incorporate Amla Chutney in Your Diet
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      With Rice and Dal
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Perfect accompaniment to complete meals, enhancing iron absorption from dal and providing vitamin C boost.
                    </Typography>
                    <Chip label="Complete Nutrition" size="small" color="primary" />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      With Indian Breads
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Excellent side dish with roti, chapati, or paratha, adding tanginess and nutritional value to the meal.
                    </Typography>
                    <Chip label="Traditional Pairing" size="small" color="secondary" />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Mixed with Yogurt
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Combine with fresh yogurt for a cooling effect and additional probiotic benefits during summer.
                    </Typography>
                    <Chip label="Summer Cooling" size="small" color="info" />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Daily Small Portions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Just 1-2 teaspoons daily provides significant vitamin C benefits without overwhelming the palate.
                    </Typography>
                    <Chip label="Daily Immunity" size="small" color="success" />
                  </Card>
                </Grid>
              </Grid>
              
              {/* Expert Tips */}
              <Card sx={{ bgcolor: 'primary.50', p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Professional Tips for Maximum Benefits
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
                  • Use fresh amla for maximum vitamin C content - frozen or dried reduces potency<br />
                  • Consume within 3-4 days when refrigerated for best nutritional value<br />
                  • Don't cook amla chutney as heat destroys vitamin C<br />
                  • Start with small quantities if you're not used to the tangy taste<br />
                  • Best consumed during or immediately after meals for optimal digestion<br />
                  • Avoid metal containers for storage - use glass containers instead
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  - Based on 11+ years of clinical nutrition experience
                </Typography>
              </Card>
              
              {/* Research-Based Benefits */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Research-Based Approach to Amla Consumption
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                Our recommendation for daily amla consumption follows research-based concepts with day-to-day monitoring. Studies have shown that consistent, moderate consumption of amla provides better long-term health benefits than sporadic high doses.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                The natural enzymes in amla work synergistically with other nutrients in your diet, which is why we emphasize consuming it as part of complete meals rather than as an isolated supplement. This aligns perfectly with our AT-HOME foods philosophy of using readily available ingredients for optimal health.
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
                  Ready to Boost Your Immunity Naturally?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get personalized nutrition plans that include immunity-boosting foods like amla
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link}
                  href="/auth/register"
                  sx={{ px: 4 }}
                >
                  Start Your Health Journey
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
                      Summer Soaked Poha Recipe
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      A refreshing summer delight with probiotics and vegetables
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