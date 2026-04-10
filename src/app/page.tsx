import Hero from '@/components/Hero';
import MarketingShowcase from '@/components/MarketingShowcase';
import CategoryStrip from '@/components/CategoryStrip';
import AboutSection from '@/components/AboutSection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <MarketingShowcase />
      <CategoryStrip />
      <AboutSection />
    </main>
  );
}
