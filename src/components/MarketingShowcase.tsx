import Image from 'next/image';
import { marketingCards } from '@/data/seed';

export default function MarketingShowcase() {
  return (
    <section className="section-block alt-bg">
      <div className="site-container">
        <div className="section-head">
          <p className="eyebrow">Front page inspiration</p>
          <h2>These images set the style of the marketplace.</h2>
          <p>
            They are examples of the kind of craftsmanship customers can expect, not products for sale.
          </p>
        </div>

        <div className="card-grid">
          {marketingCards.map((item) => (
            <article key={item.id} className="card">
              <Image src={item.image} alt={item.title} width={800} height={600} className="card-image" />
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
