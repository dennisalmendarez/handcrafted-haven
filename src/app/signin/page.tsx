import Link from 'next/link';

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#faf3dd', // eggshell
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
          Welcome Back 👋
        </h2>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            required
            style={{
              padding: '0.7rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            required
            style={{
              padding: '0.7rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />

          {/* Button */}
          <button
            style={{
              backgroundColor: '#5e6472',
              color: 'white',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Sign In
          </button>
        </form>

        {/* Extra */}
        <p
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}
        >
           Don’t have an account?{' '}
  <Link href="/signup">
    <span style={{ color: '#ffa69e', cursor: 'pointer' }}>
      Sign up
    </span>
  </Link>
        </p>
      </div>
    </div>
  );
}