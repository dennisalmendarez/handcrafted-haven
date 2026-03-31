import Link from 'next/link';

export default async function OrderPlacedPage({ searchParams }: { searchParams?: Promise<{ orderId?: string }> }) {
  const params = await searchParams;

  return (
    <main className="section-block">
      <div className="site-container">
        <div className="summary-card">
          <p className="eyebrow">Order placed</p>
          <h1>Thank you for your order.</h1>
          <p>Your confirmation number is {params?.orderId ?? 'pending'}.</p>
          <Link href="/" className="btn-link">Go Home</Link>
        </div>
      </div>
    </main>
  );
}
