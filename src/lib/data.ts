import { sql } from '@/lib/db';

export type ShopProduct = {
  id: string;
  seller_id: string | null;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  created_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  image: string;
  message: string;
  comments_enabled: boolean;
  created_at: string;
};

export async function getProducts(): Promise<ShopProduct[]> {
  const products = await sql<ShopProduct[]>`
    SELECT
      id,
      seller_id,
      name,
      category,
      price,
      description,
      image,
      stock,
      created_at
    FROM products
    ORDER BY created_at DESC
  `;

  return products;
}

export async function getPosts(): Promise<Post[]> {
  const posts = await sql<Post[]>`
    SELECT
      id,
      author_id,
      image,
      message,
      comments_enabled,
      created_at
    FROM posts
    ORDER BY created_at DESC
  `;

  return posts;
}