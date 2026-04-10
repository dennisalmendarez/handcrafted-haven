import ShopContent from '@/components/ShopContent';
import { getProducts } from '@/lib/data';

export default async function ShopPage() {
  const products = await getProducts();

  return <ShopContent products={products} />;
}