'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function SignInForm() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = login(email);
    if (!ok) {
      setError('No matching account was found.');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
          />
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="btn-link">Sign In</button>
        </form>
        <p className="auth-footer">
          Need an account? <Link href="/signup" className="text-link">Create one</Link>
        </p>
      </div>
    </section>
  );
}