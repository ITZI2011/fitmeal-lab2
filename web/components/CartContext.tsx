"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const STORAGE_KEY = "fitmeal-cart-v1";

export type CartItem = {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (
    item: { mealId: string; name: string; price: number },
    quantity?: number
  ) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  removeItem: (mealId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Charger depuis localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(parsed);
      }
    } catch (e) {
      console.error("Erreur lecture localStorage cart:", e);
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Erreur écriture localStorage cart:", e);
    }
  }, [items]);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.mealId === item.mealId);
      if (existing) {
        return prev.map((i) =>
          i.mealId === item.mealId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (
    mealId,
    quantity
  ) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.mealId === mealId ? { ...i, quantity: Math.max(quantity, 1) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem: CartContextValue["removeItem"] = (mealId) => {
    setItems((prev) => prev.filter((i) => i.mealId !== mealId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé dans un <CartProvider>");
  }
  return ctx;
}
