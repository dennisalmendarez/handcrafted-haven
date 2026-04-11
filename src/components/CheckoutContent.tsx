'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { clearCart, getCart, type CartItem } from '@/lib/cart';
import { currency } from '@/lib/utils';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type CheckoutItem = Product & {
  quantity: number;
};

export default function CheckoutContent() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [cityState, setCityState] = useState('');
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    setCart(getCart());

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoaded(true);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  const items = useMemo<CheckoutItem[]>(() => {
    return cart
      .map((entry) => {
        const product = products.find((item) => item.id === entry.productId);
        if (!product) return null;
        return { ...product, quantity: entry.quantity };
      })
      .filter(Boolean) as CheckoutItem[];
  }, [cart, products]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [items]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!session?.user) {
      setError('Please sign in before placing an order.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);

    const orderItems = items.map((item) => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: Number(item.price),
      image: item.image,
    }));

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: name,
        shipping_address: shippingAddress,
        city_state: cityState,
        zip_code: zipCode,
        items: orderItems,
        total,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || 'Failed to place order.');
      return;
    }

    clearCart();
    router.push(`/order-placed?orderId=${data.orderId}`);
    router.refresh();
  }

  if (status === 'loading' || !loaded) {
    return (
      <section className="section-block">
        <div className="site-container">
          <div className="empty-state">Loading checkout...</div>
        </div>
      </section>
    );
  }

  if (!session?.user) {
    return (
      <section className="section-block">
        <div className="site-container narrow-stack">
          <div className="section-head compact">
            <p className="eyebrow">Checkout</p>
            <h1>Please sign in to place your order.</h1>
          </div>

          <div className="empty-state">
            <Link href="/signin" className="text-link">
              Go to sign in
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="section-block">
        <div className="site-container">
          <div className="empty-state">Your cart is empty.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block">
      <div className="site-container narrow-stack">
        <div className="section-head compact">
          <p className="eyebrow">Checkout</p>
          <h1>Complete your order.</h1>
        </div>

        <form className="checkout-grid" onSubmit={handleSubmit}>
          <div className="card card-content">
            <h3>Customer details</h3>

            <input
              className="auth-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
            />

            <input
              className="auth-input"
              value={session.user.email ?? ''}
              placeholder="Email address"
              readOnly
            />

            <input
              className="auth-input"
              value={shippingAddress}
              onChange={(event) => setShippingAddress(event.target.value)}
              placeholder="Shipping address"
              required
            />

            <input
              className="auth-input"
              value={cityState}
              onChange={(event) => setCityState(event.target.value)}
              placeholder="City, State"
              required
            />

            <input
              className="auth-input"
              value={zipCode}
              onChange={(event) => setZipCode(event.target.value)}
              placeholder="ZIP code"
              required
            />

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="btn-link" disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          <div className="summary-card">
            <h3>Order summary</h3>

            {items.map((item) => (
              <div key={item.id} className="summary-line">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{currency.format(Number(item.price) * item.quantity)}</span>
              </div>
            ))}

            <div className="summary-line total-line">
              <strong>Total</strong>
              <strong>{currency.format(total)}</strong>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}