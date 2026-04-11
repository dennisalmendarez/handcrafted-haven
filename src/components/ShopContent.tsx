'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import type { ShopProduct } from '@/lib/data';

type ShopContentProps = {
  products: ShopProduct[];
  initialCategory?: string;
};

export default function ShopContent({
  products,
  initialCategory,
}: ShopContentProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? 'All');

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((product) => product.category))];
    return uniqueCategories.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <section className="section-block">
      <div className="site-container">
        <div className="section-head split-head">
          <div>
            <p className="eyebrow">Live seller catalog</p>
            <h1>Shop products posted by artisan accounts.</h1>
            <p>Everything in this section comes from the real database.</p>
          </div>

          <label className="select-wrap">
            <span>Category</span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">No products have been posted yet.</div>
        ) : (
          <div className="card-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  sellerId: product.seller_id ?? '',
                  sellerName: product.seller_name ?? 'Seller',
                  name: product.name,
                  category: product.category,
                  price: Number(product.price),
                  description: product.description,
                  image: product.image,
                  stock: product.stock,
                  createdAt: product.created_at,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}