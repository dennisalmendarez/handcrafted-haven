import Image from "next/image";

export default function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#aed9e0",
        padding: "3rem 0",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "2.3rem",
              marginBottom: "1rem",
              color: "#5e6472",
            }}
          >
            Discover Unique Handcrafted Treasures
          </h2>

          <p style={{ marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Handcrafted Haven connects artisans with people who value creativity,
            culture, and one-of-a-kind handmade goods.
          </p>

          <button
            style={{
              backgroundColor: "#ffa69e",
              border: "none",
              padding: "0.9rem 1.2rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Explore Collection
          </button>
        </div>

        <div>
          <Image
            src="/images/Hero.webp"
            alt="Artisan painting pottery"
            width={700}
            height={500}
            style={{ width: "100%", height: "auto", borderRadius: "12px" }}
          />
        </div>
      </div>
    </section>
  );
}