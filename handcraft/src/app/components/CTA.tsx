// src/components/CTA.tsx
export default function CTA() {
  return (
    <section style={{
      padding: '3rem',
      background: 'var(--icy-aqua)',
      textAlign: 'center'
    }}>
      <h2>Join Our Marketplace Today</h2>
      <button style={{
        marginTop: '1rem',
        padding: '0.8rem 1.5rem',
        background: 'var(--blue-slate)',
        color: 'white',
        border: 'none'
      }}>
        Sign Up
      </button>
    </section>
  );
}