// src/components/Navbar.tsx
export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      background: 'var(--light-blue)'
    }}>
      <h2>Handcrafted Haven</h2>
      <div>
        <a href="#" style={{ marginRight: '1rem' }}>Home</a>
        <a href="#" style={{ marginRight: '1rem' }}>About</a>
        <a href="#">Login</a>
      </div>
    </nav>
  );
}