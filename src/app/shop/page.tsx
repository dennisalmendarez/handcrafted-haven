import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ShopPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--eggshell)",
        padding: "3rem 0",
      }}
    >
      <div style={{ width: "90%", maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "2rem",
            color: "var(--blue-slate)",
          }}
        >
          Shop Our Collection
        </h1>

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
    </main>
  );
}
