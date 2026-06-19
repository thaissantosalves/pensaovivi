"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultCheckout,
  loadCartFromStorage,
  saveCartItemsToStorage,
  saveCheckoutToStorage,
} from "@/lib/cart-storage";
import type { CartItem, CheckoutData, Product } from "@/types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  hydrated: boolean;
  addItem: (product: Product, quantity: number, notes: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  checkout: CheckoutData;
  setCheckout: (data: Partial<CheckoutData>) => void;
  resetCheckout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function createCartItemId(productId: string, notes: string): string {
  return `${productId}::${notes.trim().toLowerCase()}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkout, setCheckoutState] = useState<CheckoutData>(defaultCheckout);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadCartFromStorage();
    setItems(stored.items);
    setCheckoutState(stored.checkout);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCartItemsToStorage(items);
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveCheckoutToStorage(checkout);
  }, [checkout, hydrated]);

  const addItem = useCallback(
    (product: Product, quantity: number, notes: string) => {
      const id = createCartItemId(product.id, notes);

      setItems((prev) => {
        const existing = prev.find((item) => item.id === id);
        if (existing) {
          return prev.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            id,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            notes: notes.trim(),
          },
        ];
      });
    },
    []
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const updateNotes = useCallback((id: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("pensaovivi_cart");
    }
  }, []);

  const setCheckout = useCallback((data: Partial<CheckoutData>) => {
    setCheckoutState((prev) => ({ ...prev, ...data }));
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckoutState(defaultCheckout);
    saveCheckoutToStorage(defaultCheckout);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      hydrated,
      addItem,
      updateQuantity,
      updateNotes,
      removeItem,
      clearCart,
      checkout,
      setCheckout,
      resetCheckout,
    }),
    [
      items,
      itemCount,
      total,
      hydrated,
      addItem,
      updateQuantity,
      updateNotes,
      removeItem,
      clearCart,
      checkout,
      setCheckout,
      resetCheckout,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
}
