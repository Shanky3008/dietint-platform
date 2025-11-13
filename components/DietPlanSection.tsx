'use client';

import Link from 'next/link';
import { Typography, Button, Box, Chip, Container, Grid, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/premium';
import { CheckCircle } from '@mui/icons-material';

export default function DietPlanSection() {
  const dietPlans = [
    {
      title: 'Weight Loss Template',
      description: 'A starter template coaches can adapt and assign to clients for safe, sustainable weight loss.',
      features: ['Adjustable macros', 'Meal swap guidance', 'Snack options', 'Indian cuisine variants'],
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop',
      popular: true,
      gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)'
    },
    {
      title: 'Diabetes-Friendly Template',
      description: 'Low GI template to help clients manage blood sugar levels. Ready to personalize and assign.',
      features: ['Low GI foods', 'Fiber-rich', 'Portion guidance', 'Regional options'],
      image: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=800&auto=format&fit=crop',
      popular: false,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'PCOS Management Template',
      description: 'A hormone-balancing template for coach customization and assignment to clients.',
      features: ['Anti-inflammatory', 'Low GI', 'Nutrient-dense', 'Satisfying'],
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
      popular: false,
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <Box sx={{
      py: { xs: 8, md: 12 },
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          animation: 'float 15s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />

      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2E7D32 0%, #667eea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 3,
              }}
            >
              Plan Templates Library
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Ready-to-use templates coaches can adapt and assign — speeding up plan creation without losing personalization.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {dietPlans.map((plan, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <motion.div variants={cardVariants}>
                  <GlassCard
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {plan.popular && (
                      <Chip
                        label="Most Popular"
                        sx={{
                          position: 'absolute',
                          top: 20,
                          right: 20,
                          zIndex: 2,
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                          color: 'white',
                          border: '2px solid rgba(255, 255, 255, 0.5)',
                          boxShadow: '0 4px 16px rgba(255, 152, 0, 0.4)',
                          fontSize: '0.85rem',
                          px: 2,
                          py: 2.5,
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        height: 220,
                        backgroundImage: `url(${plan.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '80px',
                          background: `linear-gradient(to top, ${alpha('#000', 0.6)}, transparent)`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          right: 16,
                          zIndex: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 4,
                            borderRadius: 2,
                            background: plan.gradient,
                            mb: 2,
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                        {plan.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                        {plan.description}
                      </Typography>

                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                          Key Features
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {plan.features.map((feature, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Button
                          variant="contained"
                          fullWidth
                          component={Link}
                          href="/dashboard/coach"
                          sx={{
                            background: plan.gradient,
                            color: 'white',
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: '12px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Use This Template
                        </Button>
                      </Box>
                    </Box>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/pricing"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                px: 6,
                py: 2.5,
                fontSize: '1.125rem',
                fontWeight: 700,
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-4px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Get Started as a Coach
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
