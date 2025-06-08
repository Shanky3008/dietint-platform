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
  Button
} from '@mui/material';
import { 
  CalendarToday, 
  Person, 
  AccessTime,
  Share,
  Bookmark
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function VirginCoconutOilBenefitsPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="md">
          {/* Article Header */}
          <Box sx={{ mb: 4 }}>
            <Chip 
              label="Healthy Ingredients" 
              color="primary" 
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              lineHeight: 1.2,
              mb: 3
            }}>
              The Power of Virgin Coconut Oil: Your Natural Health Companion
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ 
              mb: 4,
              lineHeight: 1.6
            }}>
              Discover why virgin coconut oil extracted in wood-pressed form is very healthy, rich in Vitamin E, and perfect for daily cooking routines.
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
                    5 min read
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
                Virgin coconut oil extracted in wood-pressed form is very healthy. Rich in Vitamin E, it attracts skin care properties and provides numerous health benefits when incorporated into daily cooking routines.
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Nutritional Benefits */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Nutritional Benefits of Virgin Coconut Oil
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      High Vitamin E Content
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Essential for skin health and powerful antioxidant properties that protect cells from oxidative damage.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Wood-Pressed Extraction
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Traditional extraction method that maintains nutritional integrity without chemical processing.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Daily Cooking Applications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Suitable for various cooking methods and adds healthy fats to your daily meals.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Overall Wellness Support
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contributes to overall health goals as part of a balanced nutrition plan.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Usage Recommendations */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                How to Use Virgin Coconut Oil
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 2 }}>
                Incorporating virgin coconut oil into your daily routine is simple and beneficial. Here are my recommended ways to use this wonderful natural ingredient:
              </Typography>
              
              <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Cooking at medium temperatures:</strong> Perfect for sautéing vegetables and light frying
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Smoothie addition:</strong> Add 1 tablespoon to your morning smoothie for healthy fats
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Topical application:</strong> Use as a natural moisturizer for skin care
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Indian cooking styles:</strong> Ideal replacement for refined oils in traditional recipes
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Baking substitute:</strong> Replace butter or other oils in healthy baking
                  </Typography>
                </Box>
              </Box>
              
              {/* Expert Opinion */}
              <Card sx={{ bgcolor: 'primary.50', p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Expert Insight
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  mb: 2
                }}>
                  "In my 11+ years of nutrition practice, I've seen how simple ingredient swaps like using virgin coconut oil can make significant improvements in my clients' overall health. The key is choosing quality, traditionally extracted oils that retain their natural nutritional properties."
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  - Gouri Priya Mylavarapu, MSc Nutrition
                </Typography>
              </Card>
              
              {/* AT-HOME Foods Philosophy */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Part of the AT-HOME Foods Approach
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                Virgin coconut oil perfectly embodies our AT-HOME foods philosophy. It's a readily available ingredient that doesn't require special diet products or expensive supplements. This aligns with our research-based approach of using everyday ingredients for extraordinary health benefits.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                By incorporating virgin coconut oil into your daily routine, you're taking a simple yet powerful step toward better health using ingredients that are accessible and affordable for everyone.
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
                  Ready to Transform Your Health with Personalized Nutrition?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get a customized diet plan that incorporates healthy ingredients like virgin coconut oil
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link}
                  href="/auth/register"
                  sx={{ px: 4 }}
                >
                  Book Your Consultation
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
                      Understanding Milk in Your Diet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Learn about this versatile ingredient and allergy considerations
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