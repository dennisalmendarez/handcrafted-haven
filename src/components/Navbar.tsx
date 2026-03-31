'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function Navbar() {
  const { currentUser, logout, cart } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
          <Link href="/cart">Cart ({cartCount})</Link>

          {currentUser ? (
            <>
              <Link href="/dashboard" className="btn-link">
                Dashboard
              </Link>
              <button type="button" className="btn-link btn-secondary" onClick={logout}>
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
