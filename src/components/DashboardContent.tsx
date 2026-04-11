'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { categories } from '@/data/categories';
import { currency } from '@/lib/utils';
import type { Category } from '@/data/categories';

type Product = {
  id: string;
  seller_id: string;
  seller_name?: string | null;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
};

type ProductForm = {
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image: string;
};

export default function DashboardContent() {
  const { data: session, status } = useSession();
  const currentUser = session?.user;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    category: categories[0],
    price: 0,
    stock: 1,
    description: '',
    image: '',
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

  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Failed to create product.');
      return;
    }

    setProducts((prev) => [data.product, ...prev]);
    setProductForm({
      name: '',
      category: categories[0],
      price: 0,
      stock: 1,
      description: '',
      image: '',
    });
    setMessage('Product added successfully.');
  }

  if (status === 'loading') {
    return (
      <section className="section-block">
        <div className="site-container">
          <div className="empty-state">Loading...</div>
        </div>
      </section>
    );
  }

  if (!currentUser) {
    return (
      <section className="section-block">
        <div className="site-container">
          <div className="empty-state">
            Please <Link href="/signin">sign in</Link>.
          </div>
        </div>
      </section>
    );
  }

  if (currentUser.role !== 'seller') {
    return (
      <section className="section-block">
        <div className="site-container">
          <div className="empty-state">
            This dashboard section is for seller accounts.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block">
      <div className="site-container dashboard-shell">
        <aside className="dashboard-side card">
          <h2>{currentUser.name}</h2>
          <p className="muted">{currentUser.role}</p>

          <div className="dashboard-nav">
            <a href="#products">My Products</a>
            <Link href="/">Home</Link>
          </div>
        </aside>

        <div className="dashboard-main">
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
                  min="0.01"
                  step="0.01"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  required
                />

                <input
                  className="auth-input"
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: Number(e.target.value),
                    }))
                  }
                  required
                />

                <input
                  className="auth-input"
                  placeholder="Image URL or /images/file.webp"
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                  required
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
                  required
                />

                {error ? <p className="error-text">{error}</p> : null}
                {message ? <p>{message}</p> : null}

                <button type="submit" className="btn-link">
                  Add Product
                </button>
              </form>
            </div>

            <div className="card card-content">
              <h3>My Products</h3>

              {loading ? (
                <p>Loading...</p>
              ) : sellerProducts.length === 0 ? (
                <p className="muted">No products yet.</p>
              ) : (
                <div className="mini-grid-list">
                  {sellerProducts.map((p) => (
                    <div key={p.id} className="mini-grid-item">
                      <strong>{p.name}</strong>
                      <span>{currency.format(Number(p.price))}</span>
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