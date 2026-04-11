'use client';

import Image from 'next/image';
import { currency } from '@/lib/utils';

type Product = {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  createdAt: string;
};

function isRemoteImage(src: string) {
  return src.startsWith('http://') || src.startsWith('https://');
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card product-card">
      {isRemoteImage(product.image) ? (
        <img
          src={product.image}
          alt={product.name}
          className="card-image"
          referrerPolicy="no-referrer"
        />
      ) : (
        <Image
          src={product.image}
          alt={product.name}
          width={900}
          height={700}
          className="card-image"
        />
      )}

      <div className="card-content">
        <p className="meta-line">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="muted">By {product.sellerName || 'Seller'}</p>
        <p>{product.description}</p>

        <div className="card-footer-row">
          <strong>{currency.format(product.price)}</strong>
        </div>
      </div>
    </article>
  );
}