import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/40" />
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 font-body text-muted-foreground">
            Add some delicious Andhra treats!
          </p>
          <Link
            to="/"
            className="mt-6 rounded-lg bg-primary px-8 py-3 font-body font-bold text-primary-foreground transition-all hover:bg-maroon-light"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 font-display text-3xl font-bold text-foreground">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map(({ product, quantity, weight }) => {
              const unitPrice = product.prices[weight];
              return (
                <div
                  key={`${product.id}-${weight}`}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md sm:flex-row"
                >
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-40 w-full rounded-lg object-cover sm:h-24 sm:w-24"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-card-foreground">
                        {product.name}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground">
                        {weight} · ₹{unitPrice} each
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.id, weight, quantity - 1)}
                          className="rounded-md border border-border p-2 text-foreground transition-colors hover:bg-secondary"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-body font-semibold">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, weight, quantity + 1)}
                          className="rounded-md border border-border p-2 text-foreground transition-colors hover:bg-secondary"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-start">
                        <span className="font-display text-lg font-bold text-primary">
                          ₹{unitPrice * quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id, weight)}
                          className="rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-xl font-bold text-card-foreground">
              Order Summary
            </h2>
            <div className="mt-4 space-y-2 border-b border-border pb-4">
              {items.map(({ product, quantity, weight }) => (
                <div key={`${product.id}-${weight}`} className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">
                    {product.name} ({weight}) × {quantity}
                  </span>
                  <span className="text-card-foreground">₹{product.prices[weight] * quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <span className="font-display text-lg font-bold text-card-foreground">Total</span>
              <span className="font-display text-xl font-bold text-primary">₹{totalPrice}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-lg bg-primary py-3 text-center font-body font-bold text-primary-foreground transition-all hover:bg-maroon-light active:scale-[0.98]"
            >
              Proceed to Payment
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
