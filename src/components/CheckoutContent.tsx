'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { currency } from '@/lib/utils';

export default function CheckoutContent() {
  const { cart, products, currentUser, placeOrder } = useStore();
  const router = useRouter();
  const [name, setName] = useState(currentUser?.name ?? '');

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  }, [cart, products]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const orderId = placeOrder({ customerName: name });
    if (orderId) {
      router.push(`/order-placed?orderId=${orderId}`);
    }
  }

  if (cart.length === 0) {
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
            <input className="auth-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required />
            <input className="auth-input" defaultValue={currentUser?.email ?? ''} placeholder="Email address" required />
            <input className="auth-input" placeholder="Shipping address" required />
            <input className="auth-input" placeholder="City, State" required />
            <input className="auth-input" placeholder="ZIP code" required />
            <button type="submit" className="btn-link">Place Order</button>
          </div>

          <div className="summary-card">
            <h3>Order summary</h3>
            {cart.map((entry) => {
              const product = products.find((item) => item.id === entry.productId);
              if (!product) return null;
              return (
                <div key={entry.productId} className="summary-line">
                  <span>{product.name} × {entry.quantity}</span>
                  <span>{currency.format(product.price * entry.quantity)}</span>
                </div>
              );
            })}
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
