export type CartItem = {
  productId: string;
  quantity: number;
};

const CART_STORAGE_KEY = 'handcrafted-haven-cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        typeof item?.productId === 'string' &&
        typeof item?.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function addToCart(productId: string, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
    saveCart([...cart]);
    return;
  }

  saveCart([...cart, { productId, quantity }]);
}

export function setBuyNowCart(productId: string, quantity = 1) {
  saveCart([{ productId, quantity }]);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = getCart()
    .map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(cart);
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}