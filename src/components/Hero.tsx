import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="site-container hero-grid">
        <div>
          <p className="eyebrow">Made by real artisans</p>
          <h1>Discover handcrafted work with story, skill, and soul.</h1>
          <p className="hero-copy">
            Shop authentic handmade products, follow artisans, and explore new pieces shared by sellers in one growing community marketplace.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="btn-link">
              Shop Handmade
            </Link>
            <Link href="/artisans" className="btn-link btn-secondary">
              Visit Artisans Feed
            </Link>
          </div>
        </div>

        <Image
          src="/images/Hero.webp"
          alt="Artisan creating handmade pottery"
          width={900}
          height={650}
          className="hero-image"
        />
      </div>
    </section>
  );
}
