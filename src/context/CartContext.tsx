import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, WeightOption } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  weight: WeightOption;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, weight?: WeightOption) => void;
  removeFromCart: (productId: string, weight: WeightOption) => void;
  updateQuantity: (productId: string, weight: WeightOption, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved) as any[];
      // Migrate old cart items that lack weight/prices fields
      return parsed
        .filter((i) => i.product && i.product.prices)
        .map((i) => ({
          ...i,
          weight: i.weight || "250g",
        }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, weight: WeightOption = "250g") => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.weight === weight);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.weight === weight
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, weight }];
    });
  };

  const removeFromCart = (productId: string, weight: WeightOption) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.weight === weight)));
  };

  const updateQuantity = (productId: string, weight: WeightOption, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.weight === weight ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.prices[i.weight] * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
