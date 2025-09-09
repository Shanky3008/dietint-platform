'use client';

import { Card, CardContent, Typography, Box, Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { 
  RestaurantMenu, 
  VideoCall, 
  TrendingUp, 
  Security,
  PhoneAndroid,
  LocalHospital 
} from '@mui/icons-material';

interface ContentData {
  features?: {
    title?: { value: string };
    subtitle?: { value: string };
  };
  feature_1?: {
    icon?: { value: string };
    title?: { value: string };
    description?: { value: string };
  };
  feature_2?: {
    icon?: { value: string };
    title?: { value: string };
    description?: { value: string };
  };
  feature_3?: {
    icon?: { value: string };
    title?: { value: string };
    description?: { value: string };
  };
  feature_4?: {
    icon?: { value: string };
    title?: { value: string };
    description?: { value: string };
  };
  branding?: {
    app_name?: { value: string };
  };
}

// Icon mapping
const iconMap: { [key: string]: JSX.Element } = {
  '🩺': <RestaurantMenu sx={{ fontSize: 40, color: 'primary.main' }} />,
  '📋': <VideoCall sx={{ fontSize: 40, color: 'secondary.main' }} />,
  '📱': <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
  '🎯': <Security sx={{ fontSize: 40, color: 'info.main' }} />,
  '💬': <PhoneAndroid sx={{ fontSize: 40, color: 'warning.main' }} />,
  '📊': <LocalHospital sx={{ fontSize: 40, color: 'error.main' }} />
};

const defaultFeatures = [
  {
    icon: <RestaurantMenu sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Smart Alerts',
    description: 'Know instantly when clients need attention with intelligent notifications'
  },
  {
    icon: <VideoCall sx={{ fontSize: 40, color: 'secondary.main' }} />,
    title: 'Ghost Prevention',
    description: 'Identify at-risk clients before they disappear and save revenue'
  },
  {
    icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
    title: 'Auto Nudges',
    description: 'Automated reminders that feel personal to keep clients engaged'
  },
  {
    icon: <Security sx={{ fontSize: 40, color: 'info.main' }} />,
    title: 'White-Label Branding',
    description: 'Clients see your brand, not ours - professional image guaranteed'
  }
];

export default function FeaturesSection() {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          setContent(data.content || {});
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getFeatures = () => {
    const features = [];
    for (let i = 1; i <= 4; i++) {
      const featureKey = `feature_${i}` as keyof ContentData;
      const feature = content[featureKey];
      if (feature && 'title' in feature && 'description' in feature) {
        features.push({
          icon: iconMap[feature.icon?.value || '🩺'] || defaultFeatures[i-1].icon,
          title: feature.title?.value || defaultFeatures[i-1].title,
          description: feature.description?.value || defaultFeatures[i-1].description
        });
      } else {
        features.push(defaultFeatures[i-1]);
      }
    }
    return features;
  };
  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {content.features?.title?.value || `Built for Coaches`}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {content.features?.subtitle?.value || 'Intelligent tools that help you retain more clients, save time, and scale your practice.'}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {getFeatures().map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
