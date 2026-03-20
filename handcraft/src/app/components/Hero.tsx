// src/components/Hero.tsx
export default function Hero() {
  return (
    <section style={{
      padding: '4rem 2rem',
      background: 'var(--eggshell)',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem' }}>
        Discover Unique Handmade Creations
      </h1>
      <p style={{ margin: '1rem 0' }}>
        Support artisans and explore beautifully crafted products.
      </p>
      <button style={{
        padding: '0.8rem 1.5rem',
        background: 'var(--powder-blush)',
        border: 'none',
        cursor: 'pointer'
      }}>
        Get Started
      </button>
    </section>
  );
}