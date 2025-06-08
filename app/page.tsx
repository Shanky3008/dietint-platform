import { Box } from '@mui/material';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ServicesSection from '@/components/ServicesSection';
import DietPlanSection from '@/components/DietPlanSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <HeroSection />
          <FeaturesSection />
          <ServicesSection />
          <DietPlanSection />
          <TestimonialsSection />
        </Box>
        <Footer />
        <WhatsAppButton />
      </Box>
    </>
  );
}