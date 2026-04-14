import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutBanner from "@/assets/about-banner.jpg";
import aboutStory from "@/assets/about-story.jpg";
import { Leaf, Heart, Users, Award } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={aboutBanner} alt="Andhra village farmland" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
          <div className="container relative mx-auto px-4 py-24 text-center md:py-36">
            <h1 className="font-display text-4xl font-bold text-white md:text-6xl">
              Our Story
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-body text-lg text-white/80">
              From a humble Andhra village kitchen to your doorstep
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <img
                src={aboutStory}
                alt="Traditional Andhra cooking"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-body text-sm font-semibold uppercase tracking-widest text-accent">
                Since the 1980s
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                A Legacy of Taste
              </h2>
              <div className="mt-6 space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  It all started in a small village kitchen in Andhra Pradesh, where our beloved
                  Aunty began making traditional sweets and pickles for her family using recipes
                  passed down from her grandmother.
                </p>
                <p>
                  Word spread quickly — neighbors, relatives, and soon entire villages began
                  requesting her signature Janthikalu, Bellam Gavvalu, and fiery chicken pickle.
                  What began as a labor of love became a cherished tradition.
                </p>
                <p>
                  Today, <strong className="text-foreground">80's Aunty's Kitchen</strong> brings
                  those same recipes to you — handcrafted with the same love, the same sun-dried
                  methods, and the same farm-fresh ingredients. No shortcuts, no preservatives,
                  just pure Andhra flavor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                What We Stand For
              </h2>
              <p className="mt-2 font-body text-muted-foreground">
                The values behind every bite
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Leaf,
                  title: "100% Natural",
                  desc: "Only fresh, organic ingredients sourced from local Andhra farms.",
                },
                {
                  icon: Heart,
                  title: "Made with Love",
                  desc: "Every batch is handcrafted with the same care as our very first.",
                },
                {
                  icon: Users,
                  title: "Family Recipes",
                  desc: "Generations-old recipes preserved in their authentic form.",
                },
                {
                  icon: Award,
                  title: "Premium Quality",
                  desc: "We never compromise — taste and purity come first, always.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-body text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promise */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Our Promise to You
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground leading-relaxed">
            Every product that leaves our kitchen carries the warmth of a home-cooked meal.
            We promise you'll taste the difference — the crunch of sun-dried snacks, the tang of
            hand-ground pickles, and the sweetness of jaggery-based traditions. From our family to yours.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <span className="inline-block h-1 w-8 rounded-full bg-primary" />
            <span className="inline-block h-1 w-8 rounded-full bg-accent" />
            <span className="inline-block h-1 w-8 rounded-full bg-primary" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
