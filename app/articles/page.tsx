'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Pagination,
  Skeleton
} from '@mui/material';
import { Search, FilterList, AccessTime, Person } from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Articles data including Gouri Priya's content
const articles = [
  {
    id: 'virgin-coconut-oil-benefits',
    title: 'The Power of Virgin Coconut Oil: Your Natural Health Companion',
    summary: 'Discover why virgin coconut oil extracted in wood-pressed form is very healthy, rich in Vitamin E, and perfect for daily cooking routines.',
    content: 'Virgin coconut oil extracted in wood-pressed form is very healthy. Rich in Vitamin E, it attracts skin care properties...',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop',
    category: 'Healthy Ingredients',
    readTime: 5,
    createdAt: '2025-06-08T10:00:00Z',
    author: 'Gouri Priya Mylavarapu'
  },
  {
    id: 'understanding-milk-diet',
    title: 'Understanding Milk in Your Diet: Benefits, Risks, and Smart Choices',
    summary: 'Milk is an all-rounder beverage used in different preparations, but it\'s important to understand both its benefits and potential allergic reactions.',
    content: 'Milk is an all-rounder beverage used in different beverage preparations and in preparation of many recipes...',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&auto=format&fit=crop',
    category: 'Nutrition Education',
    readTime: 6,
    createdAt: '2025-06-08T09:00:00Z',
    author: 'Gouri Priya Mylavarapu'
  },
  {
    id: 'summer-soaked-poha-recipe',
    title: 'Summer Delight: Soaked Poha with Curd and Vegetables',
    summary: 'A perfect summer delight that\'s both nutritious and refreshing, combining probiotics from curd with seasonal vegetables and light, digestible poha.',
    content: 'Soaked Poha with curd and vegetables makes for a perfect summer delight that\'s both nutritious and refreshing...',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&auto=format&fit=crop',
    category: 'Seasonal Recipes',
    readTime: 4,
    createdAt: '2025-06-08T08:00:00Z',
    author: 'Gouri Priya Mylavarapu'
  },
  {
    id: 'amla-chutney-vitamin-c-powerhouse',
    title: 'Amla Chutney: The Ultimate Vitamin C Powerhouse for Immunity',
    summary: 'Discover why amla chutney is vitamin C rich with antioxidant properties and immunity boosting benefits, making it an excellent addition to daily meals.',
    content: 'Amla chutney is vitamin C rich with antioxidant properties and immunity boosting benefits...',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    category: 'Immunity Boosting',
    readTime: 6,
    createdAt: '2025-06-08T07:00:00Z',
    author: 'Gouri Priya Mylavarapu'
  },
  {
    id: 2,
    title: 'Weight Loss: Science-Based Strategies That Work',
    summary: 'Discover scientifically-proven strategies for sustainable weight loss and long-term health.',
    content: 'Evidence-based approach to weight loss...',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
    category: 'Weight Management',
    readTime: 6,
    createdAt: '2024-01-10T14:30:00Z',
    author: 'Gouri Priya Mylavarapu'
  },
  {
    id: 3,
    title: 'Managing PCOS Through Nutrition',
    summary: 'How proper nutrition can help manage PCOS symptoms and improve overall health.',
    content: 'Understanding PCOS and nutritional strategies...',
    imageUrl: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=800&auto=format&fit=crop',
    category: 'Women\'s Health',
    readTime: 7,
    createdAt: '2024-01-08T09:15:00Z',
    author: 'Gouri Priya Mylavarapu'
  },
  {
    id: 4,
    title: 'Diabetes-Friendly Meal Planning',
    summary: 'Learn how to create delicious, blood sugar-friendly meals that support diabetes management.',
    content: 'Practical guide to diabetes meal planning...',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
    category: 'Diabetes',
    readTime: 5,
    createdAt: '2024-01-05T16:45:00Z',
    author: 'Gouri Priya Mylavarapu'
  },
  {
    id: 5,
    title: 'Sports Nutrition: Fueling Your Performance',
    summary: 'Optimize your athletic performance with proper nutrition timing and food choices.',
    content: 'Complete guide to sports nutrition...',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
    category: 'Sports Nutrition',
    readTime: 9,
    createdAt: '2024-01-03T11:20:00Z',
    author: 'Gouri Priya Mylavarapu'
  },
  {
    id: 6,
    title: 'Healthy Eating on a Budget',
    summary: 'Practical tips for maintaining a nutritious diet without breaking the bank.',
    content: 'Budget-friendly nutrition strategies...',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop',
    category: 'Budget Tips',
    readTime: 4,
    createdAt: '2024-01-01T08:00:00Z',
    author: 'Gouri Priya Mylavarapu'
  }
];

const categories = ['All', 'Healthy Ingredients', 'Nutrition Education', 'Seasonal Recipes', 'Immunity Boosting', 'Weight Management', 'Women\'s Health', 'Diabetes', 'Sports Nutrition', 'Budget Tips'];

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);
  
  const articlesPerPage = 6;

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Header Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          py: { xs: 6, md: 8 }
        }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Nutrition Articles
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                Expert insights, tips, and research-backed articles to support your health journey.
              </Typography>
            </Box>
            
            {/* Search and Filter */}
            <Grid container spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: 'white', borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{ bgcolor: 'white', borderRadius: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterList color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Container>
        </Box>
        
        {/* Articles Grid */}
        <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Card>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" height={32} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="text" height={20} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Skeleton variant="rectangular" width={80} height={24} />
                          <Skeleton variant="text" width={100} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : paginatedArticles.length > 0 ? (
                paginatedArticles.map((article) => (
                  <Grid item xs={12} md={6} lg={4} key={article.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          boxShadow: 4,
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={article.imageUrl}
                        alt={article.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 1 }}>
                          <Chip 
                            label={article.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Box>
                        
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {article.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                          {article.summary}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {article.readTime} min read
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(article.createdAt)}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          fullWidth
                          component={Link}
                          href={`/articles/${article.id}`}
                          sx={{ 
                            mt: 2,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.50' },
                            textTransform: 'none'
                          }}
                        >
                          Read Article
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      No articles found matching your criteria.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}