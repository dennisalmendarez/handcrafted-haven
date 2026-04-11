import ShopContent from '@/components/ShopContent';
import { getProducts } from '@/lib/data';

type ShopPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = await getProducts();

  return (
    <main>
      <ShopContent
        products={products}
        initialCategory={params?.category}
      />
    </main>
  );
}