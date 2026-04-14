import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { Product } from "@/data/products";
import { supabase } from "@/lib/supabase";

interface ProductContextType {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      console.log("[ProductProvider] Loading products from Supabase...");
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("[ProductProvider] Failed to fetch products:", error.message);
        return;
      }

      const rows = (data ?? []) as Array<Partial<Product>>;
      const normalizedRows = rows.map((row) => {
        const rawCategory = typeof row.category === "string" ? row.category.toLowerCase() : "";
        let normalizedCategory = "others";
        if (rawCategory.includes("pickle")) normalizedCategory = "pickles";
        else if (rawCategory.includes("snack")) normalizedCategory = "snacks";

        return {
          ...row,
          image_url: row.image_url || "/placeholder.svg",
          rating: typeof row.rating === "number" ? Math.max(0, Math.min(5, row.rating)) : 0,
          category: normalizedCategory,
          best_seller: Boolean((row as Product).best_seller),
          bestSeller: Boolean((row as Product).best_seller),
        };
      }) as Product[];

      console.log(`[ProductProvider] Products fetched: ${normalizedRows.length}`);
      console.log("[ProductProvider] Sample product:", normalizedRows[0] || null);
      setProducts(normalizedRows);
    };

    void loadProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
