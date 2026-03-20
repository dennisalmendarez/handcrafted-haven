import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Image
        src={product.image}
        alt={product.name}
        width={500}
        height={350}
        style={{ width: "100%", height: "220px", objectFit: "cover" }}
      />

      <div style={{ padding: "1rem" }}>
        <h3 style={{ marginBottom: "0.5rem", color: "#5e6472" }}>
          {product.name}
        </h3>
        <p style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
          ${product.price}
        </p>
        <p style={{ marginBottom: "1rem", lineHeight: 1.5 }}>
          {product.description}
        </p>
        <button
          style={{
            backgroundColor: "#b8f2e6",
            border: "none",
            padding: "0.7rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          View Details
        </button>
      </div>
    </article>
  );
}