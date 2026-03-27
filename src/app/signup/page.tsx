import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#faf3dd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <h2
          style={{
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: '#5e6472',
          }}
        >
          Create Account ✨
        </h2>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            required
            style={inputStyle}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            required
            style={inputStyle}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            required
            style={inputStyle}
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            required
            style={inputStyle}
          />

          {/* Button */}
          <button style={buttonStyle}>
            Sign Up
          </button>
        </form>

        {/* Link back */}
        <p style={footerText}>
          Already have an account?{' '}
          <a href="/signin" style={linkStyle}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.7rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  outline: 'none',
};

const buttonStyle = {
  backgroundColor: '#5e6472',
  color: 'white',
  border: 'none',
  padding: '0.8rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const footerText = {
  marginTop: '1rem',
  textAlign: 'center' as const,
  fontSize: '0.9rem',
};

const linkStyle = {
  color: '#ffa69e',
  textDecoration: 'none',
};