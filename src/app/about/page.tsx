export default function AboutPage() {
  return (
    <main className="section-block">
      <div className="site-container two-column-copy">
        <div>
          <p className="eyebrow">About Handcrafted Haven</p>
          <h1>A home for handmade commerce and artisan storytelling.</h1>
        </div>
        <div className="narrow-stack">
          <p>
            This platform is designed for two account types. Sellers can create products for sale, publish visual posts, manage comments, and maintain a lightweight dashboard. Customers can explore the marketplace, add items to cart, place orders, and review previous purchases.
          </p>
          <p>
            The structure is ready for a real database later. For now, the app uses a seeded demo store in localStorage so the full flow works immediately while you prepare Vercel deployment and database records.
          </p>
        </div>
      </div>
    </main>
  );
}
