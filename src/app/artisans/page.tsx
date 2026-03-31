import ArtisansFeed from '@/components/ArtisansFeed';

export default function ArtisansPage() {
  return (
    <main className="section-block">
      <div className="site-container">
        <div className="section-head">
          <p className="eyebrow">Artisan community</p>
          <h1>See what artisans are posting.</h1>
          <p>Customers and artisans can view the feed. Signed-in users can like and comment. Sellers can moderate comments on their own posts.</p>
        </div>
        <ArtisansFeed />
      </div>
    </main>
  );
}
