import Link from 'next/link';

export default function SignInForm() {
  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back 👋</h2>

        <form className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            required
            className="auth-input"
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="auth-input"
          />

          <button type="submit" className="btn-primary auth-button">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account?{' '}
          <Link href="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}