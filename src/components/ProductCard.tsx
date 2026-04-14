import { useEffect, useMemo, useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Product, WeightOption } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const weightOptions: WeightOption[] = ["250g", "500g", "1kg"];

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const productWithSupabasePricing = product as Product & {
    price?: number;
    weight_pricing?: Partial<Record<WeightOption, number>>;
    prices?: Partial<Record<WeightOption, number>>;
  };
  const placeholderImage = "/placeholder.svg";
  const imageUrl = productWithSupabasePricing.image_url || placeholderImage;
  const safeRating = typeof product.rating === "number" ? Math.max(0, Math.min(5, product.rating)) : 0;

  const supabaseWeightPricing = productWithSupabasePricing.weight_pricing || {};
  const availableWeights = useMemo(
    () => weightOptions.filter((w) => typeof supabaseWeightPricing[w] === "number"),
    [supabaseWeightPricing]
  );
  const hasWeightPricing = availableWeights.length > 0;

  const defaultWeight: WeightOption = hasWeightPricing
    ? availableWeights.includes("250g")
      ? "250g"
      : availableWeights[0]
    : "250g";

  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(defaultWeight);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  useEffect(() => {
    setSelectedWeight(defaultWeight);
  }, [defaultWeight]);

  const fallbackBasePrice =
    productWithSupabasePricing.price ?? productWithSupabasePricing.prices?.["250g"] ?? 0;

  const currentPrice = hasWeightPricing
    ? supabaseWeightPricing[selectedWeight] ?? supabaseWeightPricing[defaultWeight] ?? fallbackBasePrice
    : fallbackBasePrice;
  const displayPrice = hasWeightPricing
    ? supabaseWeightPricing[defaultWeight] ?? fallbackBasePrice
    : fallbackBasePrice;

  const productForCart: Product = {
    ...product,
    prices: {
      "250g":
        supabaseWeightPricing["250g"] ??
        productWithSupabasePricing.prices?.["250g"] ??
        fallbackBasePrice,
      "500g":
        supabaseWeightPricing["500g"] ??
        productWithSupabasePricing.prices?.["500g"] ??
        fallbackBasePrice,
      "1kg":
        supabaseWeightPricing["1kg"] ??
        productWithSupabasePricing.prices?.["1kg"] ??
        fallbackBasePrice,
    },
  };

  const handleConfirmAdd = () => {
    addToCart(productForCart, selectedWeight);
    toast.success(`${product.name} (${selectedWeight}) added to cart!`);
    setIsWeightModalOpen(false);
  };

  const fullStars = Math.floor(safeRating);
  const hasHalf = safeRating % 1 >= 0.5;

  return (
    <div className="group animate-fade-in-up overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = placeholderImage;
          }}
        />
        {(product.best_seller || product.bestSeller) && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold text-accent-foreground shadow-md">
            Best Seller
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-card-foreground">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 font-body text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < fullStars
                  ? "fill-accent text-accent"
                  : i === fullStars && hasHalf
                  ? "fill-accent/50 text-accent"
                  : "text-border"
              }`}
            />
          ))}
          <span className="ml-1 text-sm text-muted-foreground">({safeRating})</span>
        </div>

        {/* Price + Add to Cart */}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-primary">
            ₹{displayPrice}
          </span>
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-body text-sm font-semibold text-primary-foreground transition-all hover:bg-maroon-light active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {isWeightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-xl sm:p-5">
            <h4 className="font-display text-lg font-semibold text-card-foreground">Select Weight</h4>
            <p className="mt-1 font-body text-sm text-muted-foreground">{product.name}</p>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:flex">
              {(hasWeightPricing ? availableWeights : ["250g"]).map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w as WeightOption)}
                  className={`min-h-11 rounded-md px-3 py-2 font-body text-sm font-medium transition-all ${
                    selectedWeight === w
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            <p className="mt-4 font-display text-xl font-bold text-primary">₹{currentPrice}</p>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:flex">
              <button
                onClick={() => setIsWeightModalOpen(false)}
                className="flex-1 min-h-11 rounded-md border border-border px-4 py-2.5 font-body text-sm text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdd}
                className="flex-1 min-h-11 rounded-md bg-primary px-4 py-2.5 font-body text-sm font-semibold text-primary-foreground hover:bg-maroon-light"
              >
                Confirm Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
