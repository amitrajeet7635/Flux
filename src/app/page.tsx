import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import LiveDemoSection from '@/components/landing/LiveDemoSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <LiveDemoSection />
      <CTASection />
      <Footer />
    </div>
  );
}
