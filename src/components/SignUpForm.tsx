'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      let data: { error?: string } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setError(data?.error || `Request failed with status ${res.status}`);
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      router.push('/signin');
    } catch (err) {
      console.error('Signup request failed:', err);
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h1>Create account</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
          />

          <input
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            required
          />

          <select
            className="auth-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>

          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={6}
            required
          />

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="btn-link" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link href="/signin" className="text-link">Sign in</Link>
        </p>
      </div>
    </section>
  );
}