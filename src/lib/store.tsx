'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { categories } from '@/data/categories';
import {
  seedOrders,
  seedPosts,
  seedProducts,
  seedUsers,
  type FeedPost,
  type Order,
  type Product,
  type User,
  type UserRole,
} from '@/data/seed';
import { makeId } from './utils';

export type CartItem = {
  productId: string;
  quantity: number;
};

type StoreState = {
  users: User[];
  products: Product[];
  posts: FeedPost[];
  orders: Order[];
  currentUser: User | null;
  cart: CartItem[];
  categories: readonly string[];
  login: (email: string) => boolean;
  signup: (payload: { name: string; email: string; password?: string; role: UserRole }) => boolean;
  logout: () => void;
  addToCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (payload: { customerName: string }) => string | null;
  addProduct: (payload: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => void;
  updateProduct: (productId: string, payload: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addPost: (payload: { image: string; message: string }) => void;
  updatePost: (postId: string, payload: Partial<Pick<FeedPost, 'message' | 'image' | 'commentsEnabled'>>) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, message: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  blockUserFromCommenting: (postId: string, userId: string) => void;
};

type PersistedStore = {
  users: User[];
  products: Product[];
  posts: FeedPost[];
  orders: Order[];
  currentUserId: string | null;
  cart: CartItem[];
};

const STORAGE_KEY = 'handcrafted-haven-store-v1';

const StoreContext = createContext<StoreState | null>(null);

function getDefaultState(): PersistedStore {
  return {
    users: seedUsers,
    products: seedProducts,
    posts: seedPosts,
    orders: seedOrders,
    currentUserId: null,
    cart: [],
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PersistedStore>(() => {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return getDefaultState();
  }

  try {
    return JSON.parse(raw) as PersistedStore;
  } catch {
    return getDefaultState();
  }
});

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const currentUser = useMemo(
    () => data.users.find((user) => user.id === data.currentUserId) ?? null,
    [data.currentUserId, data.users],
  );

  const value = useMemo<StoreState>(() => ({
    users: data.users,
    products: data.products,
    posts: data.posts,
    orders: data.orders,
    currentUser,
    cart: data.cart,
    categories,
    login(email) {
      const user = data.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
      if (!user) return false;
      setData((prev) => ({ ...prev, currentUserId: user.id }));
      return true;
    },
    signup(payload) {
      const exists = data.users.some((entry) => entry.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) return false;
      const newUser: User = {
        id: makeId(payload.role),
        name: payload.name,
        email: payload.email,
        role: payload.role,
        bio: payload.role === 'seller'
          ? 'New artisan ready to share handmade work.'
          : 'New customer exploring handcrafted finds.',
        avatar: '/images/Hero.webp',
      };
      setData((prev) => ({
        ...prev,
        users: [newUser, ...prev.users],
        currentUserId: newUser.id,
      }));
      return true;
    },
    logout() {
      setData((prev) => ({ ...prev, currentUserId: null, cart: [] }));
    },
    addToCart(productId) {
      setData((prev) => {
        const existing = prev.cart.find((item) => item.productId === productId);
        if (existing) {
          return {
            ...prev,
            cart: prev.cart.map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          };
        }
        return { ...prev, cart: [...prev.cart, { productId, quantity: 1 }] };
      });
    },
    updateCartQuantity(productId, quantity) {
      setData((prev) => ({
        ...prev,
        cart: prev.cart
          .map((item) => (item.productId === productId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      }));
    },
    removeFromCart(productId) {
      setData((prev) => ({
        ...prev,
        cart: prev.cart.filter((item) => item.productId !== productId),
      }));
    },
    clearCart() {
      setData((prev) => ({ ...prev, cart: [] }));
    },
    placeOrder({ customerName }) {
      if (!currentUser || data.cart.length === 0) return null;
      const items = data.cart
        .map((entry) => {
          const product = data.products.find((productItem) => productItem.id === entry.productId);
          if (!product) return null;
          return {
            productId: product.id,
            productName: product.name,
            quantity: entry.quantity,
            price: product.price,
            image: product.image,
          };
        })
        .filter(Boolean) as Order['items'];

      if (items.length === 0) return null;

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderId = makeId('order');
      const order: Order = {
        id: orderId,
        customerId: currentUser.id,
        customerName,
        items,
        total,
        createdAt: new Date().toISOString(),
        status: 'Placed',
      };
      setData((prev) => ({
        ...prev,
        orders: [order, ...prev.orders],
        cart: [],
      }));
      return orderId;
    },
    addProduct(payload) {
      if (!currentUser || currentUser.role !== 'seller') return;
      const product: Product = {
        id: makeId('prod'),
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        createdAt: new Date().toISOString(),
        ...payload,
      };
      setData((prev) => ({ ...prev, products: [product, ...prev.products] }));
    },
    updateProduct(productId, payload) {
      if (!currentUser || currentUser.role !== 'seller') return;
      setData((prev) => ({
        ...prev,
        products: prev.products.map((product) =>
          product.id === productId && product.sellerId === currentUser.id
            ? { ...product, ...payload }
            : product,
        ),
      }));
    },
    deleteProduct(productId) {
      if (!currentUser || currentUser.role !== 'seller') return;
      setData((prev) => ({
        ...prev,
        products: prev.products.filter(
          (product) => !(product.id === productId && product.sellerId === currentUser.id),
        ),
      }));
    },
    addPost(payload) {
      if (!currentUser) return;
      const post: FeedPost = {
        id: makeId('post'),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        image: payload.image,
        message: payload.message,
        createdAt: new Date().toISOString(),
        likes: [],
        commentsEnabled: true,
        blockedCommentUserIds: [],
        comments: [],
      };
      setData((prev) => ({ ...prev, posts: [post, ...prev.posts] }));
    },
    updatePost(postId, payload) {
      if (!currentUser) return;
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post.id === postId && post.authorId === currentUser.id ? { ...post, ...payload } : post,
        ),
      }));
    },
    deletePost(postId) {
      if (!currentUser) return;
      setData((prev) => ({
        ...prev,
        posts: prev.posts.filter((post) => !(post.id === postId && post.authorId === currentUser.id)),
      }));
    },
    toggleLikePost(postId) {
      if (!currentUser) return;
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((post) => {
          if (post.id !== postId) return post;
          const alreadyLiked = post.likes.includes(currentUser.id);
          return {
            ...post,
            likes: alreadyLiked
              ? post.likes.filter((id) => id !== currentUser.id)
              : [...post.likes, currentUser.id],
          };
        }),
      }));
    },
    addComment(postId, message) {
      if (!currentUser) return;
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((post) => {
          if (post.id !== postId || !post.commentsEnabled || post.blockedCommentUserIds.includes(currentUser.id)) {
            return post;
          }
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: makeId('comment'),
                authorId: currentUser.id,
                authorName: currentUser.name,
                message,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),
      }));
    },
    deleteComment(postId, commentId) {
      if (!currentUser) return;
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((post) => {
          if (post.id !== postId) return post;
          const canModerate = post.authorId === currentUser.id;
          return {
            ...post,
            comments: post.comments.filter((comment) =>
              canModerate ? comment.id !== commentId : true,
            ),
          };
        }),
      }));
    },
    blockUserFromCommenting(postId, userId) {
      if (!currentUser) return;
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((post) => {
          if (post.id !== postId || post.authorId !== currentUser.id) return post;
          if (post.blockedCommentUserIds.includes(userId)) return post;
          return {
            ...post,
            blockedCommentUserIds: [...post.blockedCommentUserIds, userId],
            comments: post.comments.filter((comment) => comment.authorId !== userId),
          };
        }),
      }));
    },
  }), [currentUser, data]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return context;
}
