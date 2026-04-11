'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { currency, formatDate } from '@/lib/utils';
import type { Category } from '@/data/categories';

type Product = {
  id: string;
  seller_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
};

type ProductForm = {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image: string;
};

export default function DashboardContent() {
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [productForm, setProductForm] = useState<ProductForm>({
    id: '',
    name: '',
    category: categories[0],
    price: 0,
    stock: 1,
    description: '',
    image: '/images/pottery.webp',
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const sellerProducts = useMemo(() => {
    return products.filter((p) => p.seller_id === currentUser?.id);
  }, [products, currentUser?.id]);

  if (!currentUser) {
    return (
      <section className="section-block">
        <div className="site-container">
          <div className="empty-state">
            Please <Link href="/signin">sign in</Link>
          </div>
        </div>
      </section>
    );
  }

  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      seller_id: currentUser.id,
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      description: productForm.description,
      image: productForm.image,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setProducts((prev) => [data.product, ...prev]);

        setProductForm({
          id: '',
          name: '',
          category: categories[0],
          price: 0,
          stock: 1,
          description: '',
          image: '/images/pottery.webp',
        });
      }
    } catch (err) {
      console.error('Error creating product', err);
    }
  }

  return (
    <section className="section-block">
      <div className="site-container dashboard-shell">

        {/* SIDEBAR */}
        <aside className="dashboard-side card">
          <h2>{currentUser.name}</h2>
          <p className="muted">{currentUser.role}</p>

          <div className="dashboard-nav">
            <a href="#products">My Products</a>
            <Link href="/">Home</Link>
          </div>
        </aside>

        {/* MAIN */}
        <div className="dashboard-main">

          {/* ADD PRODUCT */}
          <section id="products" className="dashboard-double-grid">

            <div className="card card-content">
              <h3>Add Product</h3>

              <form onSubmit={handleProductSubmit} className="auth-form">
                <input
                  className="auth-input"
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />

                <select
                  className="auth-input"
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      category: e.target.value as Category,
                    }))
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  className="auth-input"
                  type="number"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                />

                <input
                  className="auth-input"
                  type="number"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: Number(e.target.value),
                    }))
                  }
                />

                <input
                  className="auth-input"
                  placeholder="Image URL"
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                />

                <textarea
                  className="auth-input textarea"
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />

                <button className="btn-link">Add Product</button>
              </form>
            </div>

            {/* PRODUCT LIST */}
            <div className="card card-content">
              <h3>My Products</h3>

              {loading ? (
                <p>Loading...</p>
              ) : sellerProducts.length === 0 ? (
                <p className="muted">No products yet</p>
              ) : (
                <div className="mini-grid-list">
                  {sellerProducts.map((p) => (
                    <div key={p.id} className="mini-grid-item">
                      <strong>{p.name}</strong>
                      <span>{currency.format(p.price)}</span>
                      <span className="muted">{p.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </section>

        </div>
      </div>
    </section>
  );
}