'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { currency } from '@/lib/utils';

export default function CartContent() {
  const { cart, products, updateCartQuantity, removeFromCart } = useStore();

  const items = cart
    .map((entry) => {
      const product = products.find((item) => item.id === entry.productId);
      if (!product) return null;
      return { ...product, quantity: entry.quantity };
    })
    .filter(Boolean);

  const total = items.reduce((sum, item) => sum + item!.price * item!.quantity, 0);

  return (
    <section className="section-block">
      <div className="site-container narrow-stack">
        <div className="section-head compact">
          <p className="eyebrow">Your cart</p>
          <h1>Review your handmade finds.</h1>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            Your cart is empty. <Link href="/shop" className="text-link">Go to shop</Link>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item!.id} className="cart-row card">
                <Image src={item!.image} alt={item!.name} width={220} height={160} className="cart-thumb" />
                <div className="cart-main">
                  <h3>{item!.name}</h3>
                  <p className="muted">{currency.format(item!.price)} each</p>
                  <div className="inline-form start">
                    <label className="muted">Qty</label>
                    <input
                      className="qty-input"
                      type="number"
                      min={1}
                      value={item!.quantity}
                      onChange={(event) => updateCartQuantity(item!.id, Number(event.target.value))}
                    />
                    <button type="button" className="text-button" onClick={() => removeFromCart(item!.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <strong>{currency.format(item!.price * item!.quantity)}</strong>
              </div>
            ))}

            <div className="summary-card">
              <h3>Total</h3>
              <strong>{currency.format(total)}</strong>
              <Link href="/checkout" className="btn-link">Proceed to Checkout</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
