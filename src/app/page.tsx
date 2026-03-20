import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProductList />
      <AboutSection />
    </main>
  );
}