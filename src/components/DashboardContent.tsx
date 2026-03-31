'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { categories } from '@/data/categories';
import { currency, formatDate } from '@/lib/utils';

export default function DashboardContent() {
  const {
    currentUser,
    products,
    posts,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    addPost,
    updatePost,
    deletePost,
    logout,
  } = useStore();

  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category: categories[0],
    price: 0,
    stock: 1,
    description: '',
    image: '/images/pottery.webp',
  });
  const [postForm, setPostForm] = useState({ id: '', message: '', image: '/images/Hero.webp', commentsEnabled: true });

  const sellerProducts = useMemo(
    () => products.filter((product) => product.sellerId === currentUser?.id),
    [currentUser?.id, products],
  );
  const sellerPosts = useMemo(
    () => posts.filter((post) => post.authorId === currentUser?.id),
    [currentUser?.id, posts],
  );
  const customerOrders = useMemo(
    () => orders.filter((order) => order.customerId === currentUser?.id),
    [currentUser?.id, orders],
  );

  if (!currentUser) {
    return (
      <section className="section-block">
        <div className="site-container">
          <div className="empty-state">
            Please <Link href="/signin" className="text-link">sign in</Link> to open the dashboard.
          </div>
        </div>
      </section>
    );
  }

  function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (productForm.id) {
      updateProduct(productForm.id, {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        description: productForm.description,
        image: productForm.image,
      });
    } else {
      addProduct({
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        description: productForm.description,
        image: productForm.image,
      });
    }
    setProductForm({ id: '', name: '', category: categories[0], price: 0, stock: 1, description: '', image: '/images/pottery.webp' });
  }

  function handlePostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (postForm.id) {
      updatePost(postForm.id, {
        message: postForm.message,
        image: postForm.image,
        commentsEnabled: postForm.commentsEnabled,
      });
    } else {
      addPost({ image: postForm.image, message: postForm.message });
    }
    setPostForm({ id: '', message: '', image: '/images/Hero.webp', commentsEnabled: true });
  }

  return (
    <section className="section-block">
      <div className="site-container dashboard-shell">
        <aside className="dashboard-side card">
          <h2>{currentUser.name}</h2>
          <p className="muted">{currentUser.role}</p>
          <p>{currentUser.bio}</p>

          <div className="dashboard-nav">
            <a href="#invoices">Invoices</a>
            {currentUser.role === 'seller' ? (
              <>
                <a href="#customers">Customers</a>
                <a href="#products">My Products</a>
                <a href="#posts">Artisan Posts</a>
              </>
            ) : (
              <a href="#orders">Previous Orders</a>
            )}
            <Link href="/">Home</Link>
          </div>

          <button type="button" className="btn-link btn-secondary full-width" onClick={logout}>
            Logout
          </button>
        </aside>

        <div className="dashboard-main">
          <section id="invoices" className="card card-content">
            <h3>Invoices</h3>
            <p className="muted">Simple demo totals for the current account.</p>
            <div className="stats-grid">
              <div className="stat-card"><span>Total Orders</span><strong>{currentUser.role === 'seller' ? sellerProducts.length : customerOrders.length}</strong></div>
              <div className="stat-card"><span>Total Revenue</span><strong>{currency.format(currentUser.role === 'seller' ? sellerProducts.reduce((sum, item) => sum + item.price, 0) : customerOrders.reduce((sum, item) => sum + item.total, 0))}</strong></div>
            </div>
          </section>

          {currentUser.role === 'seller' ? (
            <>
              <section id="customers" className="card card-content">
                <h3>Customers</h3>
                <div className="list-stack">
                  {orders.length === 0 ? <p className="muted">No customer orders yet.</p> : orders.map((order) => (
                    <div key={order.id} className="list-row">
                      <span>{order.customerName}</span>
                      <span>{currency.format(order.total)}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="products" className="dashboard-double-grid">
                <div className="card card-content">
                  <h3>{productForm.id ? 'Edit product' : 'Add product for sale'}</h3>
                  <form className="auth-form" onSubmit={handleProductSubmit}>
                    <input className="auth-input" value={productForm.name} onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Product name" required />
                    <select className="auth-input" value={productForm.category} onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value as (typeof categories)[number] }))}>
                      {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                    <input className="auth-input" type="number" min={1} value={productForm.price} onChange={(event) => setProductForm((prev) => ({ ...prev, price: Number(event.target.value) }))} placeholder="Price" required />
                    <input className="auth-input" type="number" min={1} value={productForm.stock} onChange={(event) => setProductForm((prev) => ({ ...prev, stock: Number(event.target.value) }))} placeholder="Stock" required />
                    <input className="auth-input" value={productForm.image} onChange={(event) => setProductForm((prev) => ({ ...prev, image: event.target.value }))} placeholder="Image path or URL" required />
                    <textarea className="auth-input textarea" value={productForm.description} onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Product description" required />
                    <button type="submit" className="btn-link">{productForm.id ? 'Save product' : 'Add product'}</button>
                  </form>
                </div>

                <div className="card card-content">
                  <h3>My products</h3>
                  <div className="mini-grid-list">
                    {sellerProducts.map((product) => (
                      <div key={product.id} className="mini-grid-item">
                        <strong>{product.name}</strong>
                        <span>{currency.format(product.price)}</span>
                        <span className="muted">{product.category}</span>
                        <div className="comment-tools">
                          <button type="button" className="text-button" onClick={() => setProductForm({
                            id: product.id,
                            name: product.name,
                            category: product.category,
                            price: product.price,
                            stock: product.stock,
                            description: product.description,
                            image: product.image,
                          })}>Edit</button>
                          <button type="button" className="text-button" onClick={() => deleteProduct(product.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="posts" className="dashboard-double-grid">
                <div className="card card-content">
                  <h3>{postForm.id ? 'Edit artisan post' : 'Create artisan post'}</h3>
                  <form className="auth-form" onSubmit={handlePostSubmit}>
                    <input className="auth-input" value={postForm.image} onChange={(event) => setPostForm((prev) => ({ ...prev, image: event.target.value }))} placeholder="Image path or URL" required />
                    <textarea className="auth-input textarea" value={postForm.message} onChange={(event) => setPostForm((prev) => ({ ...prev, message: event.target.value }))} placeholder="Share progress, a story, or a new release" required />
                    <label className="toggle-line">
                      <input type="checkbox" checked={postForm.commentsEnabled} onChange={(event) => setPostForm((prev) => ({ ...prev, commentsEnabled: event.target.checked }))} />
                      Allow comments
                    </label>
                    <button type="submit" className="btn-link">{postForm.id ? 'Save post' : 'Publish post'}</button>
                  </form>
                </div>

                <div className="card card-content">
                  <h3>My artisan feed</h3>
                  <div className="mini-grid-list">
                    {sellerPosts.map((post) => (
                      <div key={post.id} className="mini-grid-item">
                        <strong>{formatDate(post.createdAt)}</strong>
                        <p>{post.message}</p>
                        <span className="muted">Likes {post.likes.length} · Comments {post.comments.length}</span>
                        <div className="comment-tools">
                          <button type="button" className="text-button" onClick={() => setPostForm({ id: post.id, message: post.message, image: post.image, commentsEnabled: post.commentsEnabled })}>Edit</button>
                          <button type="button" className="text-button" onClick={() => deletePost(post.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section id="orders" className="card card-content">
              <h3>Previous Orders</h3>
              <div className="list-stack">
                {customerOrders.length === 0 ? <p className="muted">No previous orders yet.</p> : customerOrders.map((order) => (
                  <div key={order.id} className="order-card-row">
                    <div>
                      <strong>{order.id}</strong>
                      <p className="muted">{formatDate(order.createdAt)} · {order.status}</p>
                    </div>
                    <strong>{currency.format(order.total)}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
