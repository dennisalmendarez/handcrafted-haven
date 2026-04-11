'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { currency } from '@/lib/utils';
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from '@/lib/cart';

type Product = {
  id: string;
  seller_id?: string;
  seller_name?: string | null;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
};

type CartRow = Product & {
  quantity: number;
};

function isRemoteImage(src: string) {
  return src.startsWith('http://') || src.startsWith('https://');
}

export default function CartContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  const items = useMemo<CartRow[]>(() => {
    return cart
      .map((entry) => {
        const product = products.find((item) => item.id === entry.productId);
        if (!product) return null;
        return { ...product, quantity: entry.quantity };
      })
      .filter(Boolean) as CartRow[];
  }, [cart, products]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [items]);

  function handleQuantityChange(productId: string, quantity: number) {
    updateCartQuantity(productId, quantity);
    setCart(getCart());
  }

  function handleRemove(productId: string) {
    removeFromCart(productId);
    setCart(getCart());
  }

  if (!loaded) {
    return (
      <section className="section-block">
        <div className="site-container">
          <div className="empty-state">Loading cart...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block">
      <div className="site-container narrow-stack">
        <div className="section-head compact">
          <p className="eyebrow">Your cart</p>
          <h1>Review your handmade finds.</h1>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            Your cart is empty.{' '}
            <Link href="/shop" className="text-link">
              Go to shop
            </Link>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="cart-row card">
                {isRemoteImage(item.image) ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-thumb"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={220}
                    height={160}
                    className="cart-thumb"
                  />
                )}

                <div className="cart-main">
                  <h3>{item.name}</h3>
                  <p className="muted">{currency.format(Number(item.price))} each</p>

                  <div className="inline-form start">
                    <label className="muted">Qty</label>
                    <input
                      className="qty-input"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        handleQuantityChange(item.id, Number(event.target.value))
                      }
                    />
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <strong>{currency.format(Number(item.price) * item.quantity)}</strong>
              </div>
            ))}

            <div className="summary-card">
              <h3>Total</h3>
              <strong>{currency.format(total)}</strong>
              <Link href="/checkout" className="btn-link">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}