'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { currency } from '@/lib/utils';
import { addToCart, setBuyNowCart } from '@/lib/cart';

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
  return (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:image/')
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  function handleAddToCart() {
    addToCart(product.id, 1);
    router.push('/cart');
  }

  function handleBuyNow() {
    setBuyNowCart(product.id, 1);
    router.push('/checkout');
  }

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
          <strong>{currency.format(Number(product.price))}</strong>

          <div className="inline-form start">
            <button
              type="button"
              className="btn-link btn-secondary"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              type="button"
              className="btn-link"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}