export type WeightOption = "250g" | "500g" | "1kg";

export interface WeightPricing {
  "250g": number;
  "500g": number;
  "1kg": number;
}

export interface Product {
  id: string;
  name: string;
  prices: WeightPricing;
  rating?: number | null;
  image_url: string;
  image?: string;
  category?: string | null;
  description: string;
  best_seller?: boolean;
  bestSeller?: boolean;
}

export const getDefaultPrice = (product: Product): number => product.prices["250g"];
