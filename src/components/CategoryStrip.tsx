import Link from 'next/link';
import { categories } from '@/data/categories';

export default function CategoryStrip() {
  return (
    <section className="section-block">
      <div className="site-container">
        <div className="section-head compact">
          <p className="eyebrow">Browse by category</p>
          <h2>Start with the type of handmade item you want.</h2>
        </div>
        <div className="pill-row">
          {categories.map((category) => (
            <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="pill-link">
              {category}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
