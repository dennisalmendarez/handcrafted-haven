'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { categories } from '@/data/categories';
import { currency, formatDate } from '@/lib/utils';
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

type Post = {
  id: string;
  author_id: string;
  author_name?: string | null;
  author_role?: string | null;
  image: string;
  message: string;
  comments_enabled: boolean;
  created_at: string;
};

type Order = {
  id: string;
  customer_id: string;
  customer_name: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: string;
  created_at: string;
};

type ProductForm = {
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image: string;
};

type PostForm = {
  image: string;
  message: string;
  commentsEnabled: boolean;
};

export default function DashboardContent() {
  const { data: session, status } = useSession();
  const currentUser = session?.user;

  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [productMessage, setProductMessage] = useState('');
  const [productError, setProductError] = useState('');
  const [postMessage, setPostMessage] = useState('');
  const [postError, setPostError] = useState('');

  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    category: categories[0],
    price: 0,
    stock: 1,
    description: '',
    image: '',
  });

  const [postForm, setPostForm] = useState<PostForm>({
    image: '',
    message: '',
    commentsEnabled: true,
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
        setLoadingProducts(false);
      }
    }

    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoadingPosts(false);
      }
    }

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.status === 401) {
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchProducts();
    fetchPosts();
    fetchOrders();
  }, []);

  const sellerProducts = useMemo(() => {
    return products.filter((p) => p.seller_id === currentUser?.id);
  }, [products, currentUser?.id]);

  const sellerPosts = useMemo(() => {
    return posts.filter((p) => p.author_id === currentUser?.id);
  }, [posts, currentUser?.id]);

  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProductError('');
    setProductMessage('');

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm),
    });

    const data = await res.json();

    if (!res.ok) {
      setProductError(data.error || 'Failed to create product.');
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
    setProductMessage('Product added successfully.');
  }

  async function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPostError('');
    setPostMessage('');

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postForm),
    });

    const data = await res.json();

    if (!res.ok) {
      setPostError(data.error || 'Failed to create post.');
      return;
    }

    setPosts((prev) => [data.post, ...prev]);
    setPostForm({
      image: '',
      message: '',
      commentsEnabled: true,
    });
    setPostMessage('Post published successfully.');
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

  return (
    <section className="section-block">
      <div className="site-container dashboard-shell">
        <aside className="dashboard-side card">
          <h2>{currentUser.name}</h2>
          <p className="muted">{currentUser.role}</p>

          <div className="dashboard-nav">
            {currentUser.role === 'seller' ? <a href="#products">My Products</a> : null}
            {currentUser.role === 'seller' ? <a href="#posts">My Posts</a> : null}
            <a href="#orders">Order History</a>
            <Link href="/">Home</Link>
          </div>
        </aside>

        <div className="dashboard-main">
          {currentUser.role === 'seller' ? (
            <>
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

                    {productError ? <p className="error-text">{productError}</p> : null}
                    {productMessage ? <p>{productMessage}</p> : null}

                    <button type="submit" className="btn-link">
                      Add Product
                    </button>
                  </form>
                </div>

                <div className="card card-content">
                  <h3>My Products</h3>

                  {loadingProducts ? (
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

              <section id="posts" className="dashboard-double-grid">
                <div className="card card-content">
                  <h3>Create Artisan Post</h3>

                  <form onSubmit={handlePostSubmit} className="auth-form">
                    <input
                      className="auth-input"
                      placeholder="Image URL or /images/file.webp"
                      value={postForm.image}
                      onChange={(e) =>
                        setPostForm((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      required
                    />

                    <textarea
                      className="auth-input textarea"
                      placeholder="Share what you are working on..."
                      value={postForm.message}
                      onChange={(e) =>
                        setPostForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      required
                    />

                    <label className="toggle-line">
                      <input
                        type="checkbox"
                        checked={postForm.commentsEnabled}
                        onChange={(e) =>
                          setPostForm((prev) => ({
                            ...prev,
                            commentsEnabled: e.target.checked,
                          }))
                        }
                      />
                      <span>Allow comments</span>
                    </label>

                    {postError ? <p className="error-text">{postError}</p> : null}
                    {postMessage ? <p>{postMessage}</p> : null}

                    <button type="submit" className="btn-link">
                      Publish Post
                    </button>
                  </form>
                </div>

                <div className="card card-content">
                  <h3>My Posts</h3>

                  {loadingPosts ? (
                    <p>Loading...</p>
                  ) : sellerPosts.length === 0 ? (
                    <p className="muted">No posts yet.</p>
                  ) : (
                    <div className="list-stack">
                      {sellerPosts.map((post) => (
                        <div key={post.id} className="mini-grid-item">
                          <strong>{post.message}</strong>
                          <span className="muted">
                            {post.comments_enabled ? 'Comments on' : 'Comments off'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : null}

          <section id="orders" className="card card-content">
            <h3>Order History</h3>

            {loadingOrders ? (
              <p>Loading...</p>
            ) : orders.length === 0 ? (
              <p className="muted">No orders yet.</p>
            ) : (
              <div className="list-stack">
                {orders.map((order) => (
                  <div key={order.id} className="card card-content">
                    <div className="order-card-row">
                      <strong>Order #{order.id}</strong>
                      <span className="muted">{formatDate(order.created_at)}</span>
                    </div>

                    <div className="order-card-row">
                      <span>Status</span>
                      <strong>{order.status}</strong>
                    </div>

                    {(Array.isArray(order.items) ? order.items : []).map((item) => (
                      <div key={`${order.id}-${item.productId}`} className="list-row">
                        <span>
                          {item.productName} × {item.quantity}
                        </span>
                        <span>{currency.format(Number(item.price) * item.quantity)}</span>
                      </div>
                    ))}

                    <div className="summary-line total-line">
                      <strong>Total</strong>
                      <strong>{currency.format(Number(order.total))}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}