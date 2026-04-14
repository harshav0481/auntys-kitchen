import { ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { useCombos } from "@/context/ComboContext";
import { Product, WeightOption } from "@/data/products";
import { toast } from "sonner";

const ComboBundles = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { combos } = useCombos();

  const getCartProduct = (product: Product): Product => {
    const source = product as Product & {
      price?: number;
      weight_pricing?: Partial<Record<WeightOption, number>>;
      prices?: Partial<Record<WeightOption, number>>;
    };
    const fallbackBasePrice = source.price ?? source.prices?.["250g"] ?? 0;
    const pricing = source.weight_pricing || source.prices || {};

    return {
      ...product,
      prices: {
        "250g": pricing["250g"] ?? fallbackBasePrice,
        "500g": pricing["500g"] ?? fallbackBasePrice,
        "1kg": pricing["1kg"] ?? fallbackBasePrice,
      },
    };
  };

  const getDefaultWeight = (product: Product): WeightOption => {
    const source = product as Product & {
      weight_pricing?: Partial<Record<WeightOption, number>>;
      prices?: Partial<Record<WeightOption, number>>;
    };
    const pricing = source.weight_pricing || source.prices || {};
    if (typeof pricing["250g"] === "number") return "250g";
    if (typeof pricing["500g"] === "number") return "500g";
    if (typeof pricing["1kg"] === "number") return "1kg";
    return "250g";
  };

  const handleAddCombo = (productIds: string[]) => {
    let addedCount = 0;
    productIds.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      const cartProduct = getCartProduct(product);
      const defaultWeight = getDefaultWeight(product);
      addToCart(cartProduct, defaultWeight);
      addedCount += 1;
    });

    if (addedCount > 0) {
      toast.success("Combo added to cart!");
    } else {
      toast.error("No valid combo products found.");
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Combo Bundles
        </h2>
        <p className="mt-2 font-body text-muted-foreground">
          Save more with our curated combos (250g each)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {combos.map((combo) => {
          const originalPrice = combo.original_price ?? 0;
          const comboPrice = combo.combo_price ?? 0;
          const savings = Math.max(originalPrice - comboPrice, 0);
          const discount = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;
          const comboProducts = (combo.items || [])
            .map((id) => products.find((p) => p.id === id))
            .filter((p): p is Product => Boolean(p));

          return (
            <div
              key={combo.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Discount badge */}
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold text-accent-foreground shadow-md">
                <Tag className="h-3 w-3" />
                Save {discount}%
              </div>

              {/* Product images */}
              <div className="flex h-40 overflow-hidden">
                {comboProducts.map((p) => (
                  <div key={p.id} className="flex-1 overflow-hidden">
                    <img
                      src={p.image_url || "/placeholder.svg"}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-card-foreground">
                  {combo.name}
                </h3>
                <p className="mt-1 font-body text-sm text-muted-foreground">
                  {combo.description || "Special combo offer"}
                </p>
                {combo.offer && (
                  <p className="mt-1 font-body text-xs font-semibold text-accent">{combo.offer}</p>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <span className="font-display text-xl font-bold text-primary">
                    ₹{comboPrice}
                  </span>
                  <span className="font-body text-sm text-muted-foreground line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-body text-xs font-semibold text-primary">
                    Save ₹{savings}
                  </span>
                </div>

                <button
                  onClick={() => handleAddCombo(combo.items || [])}
                  className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-body text-sm font-semibold text-primary-foreground transition-all hover:bg-maroon-light active:scale-[0.98]"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add Combo to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ComboBundles;
