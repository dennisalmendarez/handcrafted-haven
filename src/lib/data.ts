import { sql } from '@/lib/db';

export type ShopProduct = {
  id: string;
  seller_id: string | null;
  seller_name: string | null;
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
  author_name: string | null;
  author_role: string | null;
  image: string;
  message: string;
  comments_enabled: boolean;
  created_at: string;
};

export async function getProducts(): Promise<ShopProduct[]> {
  return sql<ShopProduct[]>`
    SELECT
      p.id,
      p.seller_id,
      u.name AS seller_name,
      p.name,
      p.category,
      p.price,
      p.description,
      p.image,
      p.stock,
      p.created_at
    FROM products p
    LEFT JOIN users u ON u.id = p.seller_id
    ORDER BY p.created_at DESC
  `;
}

export async function getPosts(): Promise<Post[]> {
  return sql<Post[]>`
    SELECT
      p.id,
      p.author_id,
      u.name AS author_name,
      u.role AS author_role,
      p.image,
      p.message,
      p.comments_enabled,
      p.created_at
    FROM posts p
    LEFT JOIN users u ON u.id = p.author_id
    ORDER BY p.created_at DESC
  `;
}