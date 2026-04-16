import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import ArtisanPostsList from "@/components/ArtisanPostsList";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductList />
      <AboutSection />
    </main>
  );
}
