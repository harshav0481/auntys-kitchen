import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Traditional Andhra food spread" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="max-w-xl animate-fade-in-up">
          <p className="font-body text-sm font-semibold uppercase tracking-widest text-accent">
            Homemade with Love
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
            Taste the Authentic Andhra Flavors
          </h1>
          <p className="mt-4 font-body text-lg text-primary-foreground/80">
            Traditional sweets, crispy snacks & spicy pickles — handcrafted from recipes passed down through generations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/best-sellers"
              className="rounded-lg bg-accent px-8 py-3 font-body font-bold text-accent-foreground shadow-lg transition-all hover:shadow-xl active:scale-95"
            >
              Shop Best Sellers
            </Link>
            <Link
              to="/pickles"
              className="rounded-lg border-2 border-primary-foreground/30 px-8 py-3 font-body font-semibold text-primary-foreground transition-all hover:border-primary-foreground/60 hover:bg-primary-foreground/10"
            >
              Explore Pickles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
