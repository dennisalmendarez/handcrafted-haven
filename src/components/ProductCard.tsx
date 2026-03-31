'use client';

import Image from 'next/image';
import type { Product } from '@/data/seed';
import { useStore } from '@/lib/store';
import { currency } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <article className="card product-card">
      <Image src={product.image} alt={product.name} width={900} height={700} className="card-image" />
      <div className="card-content">
        <p className="meta-line">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="muted">By {product.sellerName}</p>
        <p>{product.description}</p>
        <div className="card-footer-row">
          <strong>{currency.format(product.price)}</strong>
          <button type="button" className="btn-link" onClick={() => addToCart(product.id)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
