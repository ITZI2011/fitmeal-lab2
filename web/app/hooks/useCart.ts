"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export type CartItem = {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (mealId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.mealId === item.mealId);
      if (existing) {
        return prev.map((i) =>
          i.mealId === item.mealId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (mealId: string) => {
    setItems((prev) => prev.filter((i) => i.mealId !== mealId));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, clearCart }),
    [items]
  );

  // ⚠️ ici on NE met plus de JSX pour que .ts soit accepté
  return React.createElement(
    CartContext.Provider,
    { value },
    children
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé à l’intérieur de CartProvider.");
  }
  return ctx;
}
