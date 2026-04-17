// src/app/artisans/page.tsx
import ArtisansFeed from "@/components/ArtisansFeed";
import { getPosts } from "@/lib/data";

export default async function ArtisansPage() {
  const initialPosts = await getPosts();

  return (
    <main className="section-block">
      <div className="site-container">
        <div className="section-head">
          <p className="eyebrow">Artisan Feed</p>
          <h1>Latest from our Makers</h1>
          <p>Real-time updates and stories shared by artisans in our community.</p>
        </div>
        {/* We use the existing ArtisansFeed which handles likes/comments */}
        <ArtisansFeed />
      </div>
    </main>
  );
}