import ShopContent from '@/components/ShopContent';
import { getProducts } from '@/lib/data';

export default async function ShopPage() {
  // Fetch real products from PostgreSQL
  const products = await getProducts();

  return (
    <main>
      <ShopContent products={products} />
    </main>
  );
}