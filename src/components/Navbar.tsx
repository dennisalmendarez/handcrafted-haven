'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link href="/" className="brand-mark">
          Handcrafted Haven
        </Link>

        <nav className="site-nav">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/artisans">Artisans</Link>
          <Link href="/about">About</Link>

          {status === 'authenticated' ? (
            <>
              <Link href="/dashboard" className="btn-link">
                Dashboard
              </Link>

              <button
                type="button"
                className="btn-link btn-secondary"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/signin" className="btn-link">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}