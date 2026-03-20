// src/components/Features.tsx
export default function Features() {
  return (
    <section style={{ padding: '3rem 2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Why Choose Us?</h2>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '2rem'
      }}>
        <div>
          <h3>🧵 Handmade Quality</h3>
          <p>All products are crafted with care.</p>
        </div>

        <div>
          <h3>🌍 Support Artisans</h3>
          <p>Empowering creators worldwide.</p>
        </div>

        <div>
          <h3>🚚 Fast Delivery</h3>
          <p>Quick and reliable shipping.</p>
        </div>
      </div>
    </section>
  );
}