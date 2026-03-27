import Link from "next/link";

export default function Navbar() {
  return (
    <header
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid #ddd",
        padding: "1rem 0",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1 style={{ color: "#5e6472" }}>Handcrafted Haven</h1>

        <nav
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/artisans">Artisans</Link>
          <Link href="/about">About</Link>

          <button
            style={{
              backgroundColor: "#5e6472",
              color: "white",
              border: "none",
              padding: "0.7rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </nav>
      </div>
    </header>
  );
}
