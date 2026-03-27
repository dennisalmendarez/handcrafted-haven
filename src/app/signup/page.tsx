import Link from 'next/link';

export default function SignUpPage() {
  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2 className="auth-title">Create Account ✨</h2>

        <form className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="auth-input"
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="auth-input"
          />

          <button type="submit" className="btn-primary auth-button">
            Sign Up
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link href="/signin" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}