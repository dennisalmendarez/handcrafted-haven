import type { Category } from './categories';

export type UserRole = 'seller' | 'customer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string;
  avatar: string;
};

export type Product = {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  stock: number;
  createdAt: string;
};

export type FeedPostComment = {
  id: string;
  authorId: string;
  authorName: string;
  message: string;
  createdAt: string;
};

export type FeedPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  image: string;
  message: string;
  createdAt: string;
  likes: string[];
  commentsEnabled: boolean;
  blockedCommentUserIds: string[];
  comments: FeedPostComment[];
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: 'Placed' | 'Paid' | 'Preparing';
};

export const marketingCards = [
  {
    id: 'm1',
    title: 'Pottery shaped by tradition',
    image: '/images/pottery.webp',
    description:
      'Explore handcrafted pieces inspired by culture, color, and patient artisan work.',
  },
  {
    id: 'm2',
    title: 'Decor made to feel personal',
    image: '/images/elefant.webp',
    description:
      'Find meaningful accents that make a home feel warmer, more human, and more original.',
  },
  {
    id: 'm3',
    title: 'Tables filled with character',
    image: '/images/plates.webp',
    description:
      'Discover handmade items that turn everyday meals and spaces into conversation pieces.',
  },
];

export const seedUsers: User[] = [];
export const seedProducts: Product[] = [];
export const seedPosts: FeedPost[] = [];
export const seedOrders: Order[] = [];