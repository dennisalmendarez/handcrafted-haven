import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Hand-Painted Elephant",
    price: 35,
    description: "A colorful handcrafted elephant made with care.",
    image: "/images/elefant.webp",
  },
  {
    id: 2,
    name: "Decorative Pottery Vase",
    price: 42,
    description: "Beautiful artisan pottery with painted details.",
    image: "/images/Hero.webp",
  },
  {
    id: 3,
    name: "Ceramic Plate Set",
    price: 28,
    description: "Creative ceramic plates with unique village designs.",
    image: "/images/plates.webp",
  },
  {
    id: 4,
    name: "Clay Kitchen Set",
    price: 24,
    description: "Simple and elegant handcrafted clay pieces.",
    image: "/images/pottery.webp",
  },
];

export default function ProductList() {
  return (
    <section style={{ padding: "3rem 0", backgroundColor: "#faf3dd" }}>
      <div style={{ width: "90%", maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
            color: "#5e6472",
          }}
        >
          Featured Products
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}