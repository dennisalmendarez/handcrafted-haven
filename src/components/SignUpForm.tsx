'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useStore } from '@/lib/store';
import type { UserRole } from '@/data/seed';

export default function SignUpForm() {
  const { signup } = useStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = signup({ name, email, role });
    if (!ok) {
      setError('That email already exists in the demo store.');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h1>Create account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input className="auth-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required />
          <input className="auth-input" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" required />
          <select className="auth-input" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>
          <input className="auth-input" type="password" placeholder="Password" required />
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="btn-link">Create Account</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link href="/signin" className="text-link">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
