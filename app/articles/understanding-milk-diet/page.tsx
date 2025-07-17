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
  Alert
} from '@mui/material';
import { 
  CalendarToday, 
  Person, 
  AccessTime,
  Share,
  Bookmark,
  Warning
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function UnderstandingMilkDietPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="md">
          {/* Article Header */}
          <Box sx={{ mb: 4 }}>
            <Chip 
              label="Nutrition Education" 
              color="primary" 
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              lineHeight: 1.2,
              mb: 3
            }}>
              Understanding Milk in Your Diet: Benefits, Risks, and Smart Choices
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ 
              mb: 4,
              lineHeight: 1.6
            }}>
              Milk is an all-rounder beverage used in different preparations, but it's important to understand both its benefits and potential allergic reactions.
            </Typography>
            
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
                    MSc Nutrition | 15+ Years Experience
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
              {/* Important Alert */}
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Important Note:</strong> Milk can be highly allergic for some individuals. Always consult with a healthcare provider if you experience any adverse reactions to dairy products.
                </Typography>
              </Alert>
              
              {/* Introduction */}
              <Typography variant="body1" paragraph sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.7,
                mb: 3,
                fontWeight: 'medium'
              }}>
                Milk is an all-rounder beverage used in different beverage preparations and in preparation of many recipes. As a nutrition professional with over 15 years of experience, I've seen how milk can be both beneficial and problematic depending on individual tolerance and quality choices.
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Nutritional Profile */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Nutritional Profile of Milk
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Complete Protein Source
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contains all essential amino acids needed for muscle building, tissue repair, and overall growth.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Calcium & Vitamin D
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Essential for bone health, teeth strength, and proper muscle function throughout life.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      B-Vitamins Complex
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Important for energy metabolism, nervous system function, and red blood cell formation.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Versatile Ingredient
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Can be used in countless preparations from beverages to cooking and baking.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Important Considerations */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Important Health Considerations
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200', mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Warning color="warning" />
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Allergic Reactions Possible
                        </Typography>
                        <Typography variant="body2">
                          Some individuals may experience allergic reactions ranging from mild discomfort to severe symptoms. Always monitor your body's response when introducing dairy.
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200', mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Lactose Intolerance Awareness
                    </Typography>
                    <Typography variant="body2">
                      Many adults have reduced ability to digest lactose, leading to digestive discomfort. Symptoms include bloating, gas, and digestive upset.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Quality Matters
                    </Typography>
                    <Typography variant="body2">
                      Choose organic, grass-fed milk when possible for better nutritional profile and reduced exposure to hormones and antibiotics.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              {/* Healthy Milk Preparations */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Healthy Milk Preparations
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
                When milk is well-tolerated, it can be incorporated into various healthy preparations that enhance its nutritional value:
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Turmeric Milk (Golden Milk)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Add turmeric, ginger, and a pinch of black pepper for anti-inflammatory benefits and immunity support.
                    </Typography>
                    <Chip label="Immunity Boost" size="small" color="primary" />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Protein Smoothies
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Blend with fruits, nuts, and seeds for a complete meal replacement rich in nutrients.
                    </Typography>
                    <Chip label="Post-Workout" size="small" color="secondary" />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Traditional Lassi
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Fermented milk drink with probiotics for digestive health and cooling properties.
                    </Typography>
                    <Chip label="Digestive Health" size="small" color="success" />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Healthy Milkshakes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Use natural sweeteners like dates or honey instead of refined sugar.
                    </Typography>
                    <Chip label="Natural Sweetening" size="small" color="warning" />
                  </Card>
                </Grid>
              </Grid>
              
              {/* Portion Control Guidelines */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Portion Control for Weight Management
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                While milk provides valuable nutrients, portion control is important for weight management. Here are my recommendations based on individual health goals:
              </Typography>
              
              <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>For weight loss:</strong> 1-2 cups per day, preferably low-fat or skim varieties
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>For maintenance:</strong> 2-3 cups per day as part of balanced nutrition
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>For muscle building:</strong> Include with post-workout meals for protein synthesis
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>For children:</strong> Follow age-appropriate guidelines from pediatric recommendations
                  </Typography>
                </Box>
              </Box>
              
              {/* Expert Opinion */}
              <Card sx={{ bgcolor: 'primary.50', p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Professional Insight
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  mb: 2
                }}>
                  "In my practice, I've learned that milk isn't suitable for everyone. The key is individual assessment - understanding your body's response and choosing quality products when milk is well-tolerated. For those with lactose intolerance or allergies, there are excellent plant-based alternatives that can provide similar nutritional benefits."
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  - Gouri Priya Mylavarapu, MSc Nutrition
                </Typography>
              </Card>
              
              {/* Research-Based Approach */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Research-Based Approach to Dairy
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                Our approach to including milk in your diet follows research-based concepts with day-to-day monitoring. We assess your individual tolerance, health goals, and lifestyle factors to determine the optimal role of dairy in your nutrition plan.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                This personalized approach ensures that you get the benefits of dairy when appropriate while avoiding potential adverse effects through careful monitoring and adjustment.
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
                  Confused About Dairy in Your Diet?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get personalized guidance on whether dairy is right for your health goals
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link}
                  href="/auth/register"
                  sx={{ px: 4 }}
                >
                  Schedule Your Assessment
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
                      Amla Chutney Benefits
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Vitamin C powerhouse for immunity and health
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