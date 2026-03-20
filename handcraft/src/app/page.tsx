// src/app/page.tsx

import Navbar from 'src/app/components/Navbar';
import Hero from 'src/app/components/Hero';
import Features from 'src/app/components/Features';
import CTA from 'src/app/components/CTA';
import Footer from 'src/app/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}