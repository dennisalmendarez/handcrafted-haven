import Link from 'next/link';

export default async function OrderPlacedPage({
  searchParams,
}: {
  searchParams?: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="section-block">
      <div className="site-container">
        <div className="summary-card">
          <p className="eyebrow">Order placed</p>
          <h1>Thank you for your order.</h1>
          <p>Your order number is {params?.orderId ?? 'pending'}.</p>
          <p>Your order will appear in your dashboard order history with the status <strong>Ordered</strong>.</p>
          <Link href="/dashboard" className="btn-link">
            View Order History
          </Link>
        </div>
      </div>
    </main>
  );
}