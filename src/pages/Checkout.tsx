import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const VALID_COUPONS: Record<string, number> = {
    AUNTY10: 10,
    FIRST20: 20,
    SPICY15: 15,
  };

  const discount = couponApplied && VALID_COUPONS[coupon.toUpperCase()]
    ? Math.round(totalPrice * VALID_COUPONS[coupon.toUpperCase()] / 100)
    : 0;
  const finalPrice = totalPrice - discount;

  const handleApplyCoupon = () => {
    if (VALID_COUPONS[coupon.toUpperCase()]) {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code");
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderLines = items.map(({ product, quantity, weight }) => {
      const lineTotal = product.prices[weight] * quantity;
      return `- ${product.name} (${weight}) x${quantity} = ₹${lineTotal}`;
    });

    const message = [
      "Order Details:",
      ...orderLines,
      "",
      `Total: ₹${finalPrice}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/7989683953?text=${encodeURIComponent(message)}`;

    clearCart();
    window.location.href = whatsappUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 font-display text-3xl font-bold text-foreground">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Address */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold text-card-foreground">
                Delivery Address
              </h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                required
                placeholder="Enter your full delivery address..."
                className="mt-4 w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Payment */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold text-card-foreground">
                Payment Method
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  { value: "upi", label: "UPI (Google Pay / PhonePe)" },
                  { value: "card", label: "Credit / Debit Card" },
                  { value: "cod", label: "Cash on Delivery" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                      paymentMethod === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="font-body font-medium text-card-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
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

            {/* Coupon Box */}
            <div className="mt-4 border-b border-border pb-4">
              <label className="font-body text-sm font-medium text-card-foreground">
                Coupon Code
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); setCouponError(""); }}
                  placeholder="Enter coupon"
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="min-h-11 rounded-lg bg-primary px-4 py-2 font-body text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="mt-2 font-body text-sm text-accent">
                  ✓ Coupon applied! {VALID_COUPONS[coupon.toUpperCase()]}% off
                </p>
              )}
              {couponError && (
                <p className="mt-2 font-body text-sm text-destructive">{couponError}</p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-card-foreground">₹{totalPrice}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-accent">Discount</span>
                  <span className="text-accent">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-display text-lg font-bold text-card-foreground">Total</span>
                <span className="font-display text-xl font-bold text-primary">₹{finalPrice}</span>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 min-h-11 w-full rounded-lg bg-accent py-3 font-body font-bold text-accent-foreground shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
            >
              Place Order
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
