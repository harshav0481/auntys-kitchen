import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import ComboBundles from "@/components/ComboBundles";
import { useProducts } from "@/context/ProductContext";
import { Leaf, Sun, Sprout } from "lucide-react";
import natureBanner from "@/assets/nature-banner.jpg";

const Index = () => {
  const { products } = useProducts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />

        {/* Best Sellers */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Our Best Sellers
            </h2>
            <p className="mt-2 font-body text-muted-foreground">
              Loved by thousands across Andhra Pradesh
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products
              .filter((p) => Boolean(p.best_seller))
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>

        {/* Nature Banner - Farm to Table */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={natureBanner} alt="Lush green farm" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/60 to-green-900/80" />
          </div>
          <div className="container relative mx-auto px-4 py-20 text-center">
            <Leaf className="mx-auto mb-4 h-10 w-10 text-green-300" />
            <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
              From Farm to Your Table
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-green-100">
              Every ingredient is sourced from local Andhra farms. We believe in the purity of
              nature — no preservatives, no artificial flavors, just honest homemade goodness.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <span className="inline-block h-1 w-8 rounded-full bg-green-400" />
              <span className="inline-block h-1 w-8 rounded-full bg-green-300" />
              <span className="inline-block h-1 w-8 rounded-full bg-green-400" />
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-2 font-body text-muted-foreground">
              Nature's best, crafted with love
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Leaf,
                title: "100% Natural Ingredients",
                desc: "We use only fresh, organic ingredients sourced directly from local Andhra farms.",
              },
              {
                icon: Sun,
                title: "Traditional Sun-Dried Process",
                desc: "Our snacks and pickles follow age-old sun-drying methods for authentic taste.",
              },
              {
                icon: Sprout,
                title: "No Preservatives",
                desc: "Zero artificial preservatives or chemicals. Pure, wholesome food as nature intended.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 transition-colors group-hover:bg-green-200">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold text-card-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Combo Bundles */}
        <ComboBundles />

        {/* Testimonials */}
        <Testimonials />

        {/* All Products */}
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                All Products
              </h2>
              <p className="mt-2 font-body text-muted-foreground">
                Handcrafted with authentic recipes
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
