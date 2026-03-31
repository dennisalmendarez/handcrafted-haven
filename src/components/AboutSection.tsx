import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="section-block">
      <div className="site-container two-column-copy">
        <div>
          <p className="eyebrow">Why Handcrafted Haven</p>
          <h2>A marketplace built for selling and storytelling.</h2>
        </div>
        <div>
          <p>
            Sellers can list handmade products, share progress photos like a mini social feed, and manage conversations around their work.
            Customers can shop, follow the artisans page, and review previous orders from their dashboard.
          </p>
          <Link href="/about" className="text-link">
            Read more about the platform
          </Link>
        </div>
      </div>
    </section>
  );
}
