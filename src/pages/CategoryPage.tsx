import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { useProducts } from "@/context/ProductContext";

const categoryConfig: Record<string, { title: string; description: string; filter: (p: Product) => boolean }> = {
  "best-sellers": {
    title: "Best Sellers",
    description: "Our most loved products by customers across India",
    filter: (p) => !!p.bestSeller,
  },
  pickles: {
    title: "All Pickles",
    description: "Spicy, tangy & irresistible — authentic Andhra pickles",
    filter: (p) => (p.category || "").toLowerCase() === "pickles",
  },
  snacks: {
    title: "Snacks",
    description: "Crispy traditional snacks for every occasion",
    filter: (p) => (p.category || "").toLowerCase() === "snacks",
  },
};

const CategoryPage = () => {
  const { products } = useProducts();
  const { category } = useParams<{ category: string }>();
  const config = categoryConfig[category || ""];

  if (!config) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Category not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const filtered = products.filter(config.filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            {config.title}
          </h1>
          <p className="mt-2 font-body text-muted-foreground">{config.description}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
