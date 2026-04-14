import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Lakshmi Devi",
    location: "Vijayawada",
    rating: 5,
    text: "The Chicken Pickle tastes exactly like my grandmother used to make! Pure authentic Andhra flavor. I order every month without fail.",
    product: "Chicken Pickle",
  },
  {
    name: "Ravi Kumar",
    location: "Hyderabad",
    rating: 5,
    text: "Best Janthikalu I've ever had outside of my hometown. Crispy, fresh, and perfectly spiced. My family loved them!",
    product: "Janthikalu",
  },
  {
    name: "Priya Sharma",
    location: "Bangalore",
    rating: 4,
    text: "Bellam Gavvalu brought back so many childhood memories. The jaggery flavor is spot on. Great quality and packaging too.",
    product: "Bellam Gavvalu",
  },
  {
    name: "Suresh Reddy",
    location: "Chennai",
    rating: 5,
    text: "Ordered the combo pack for Sankranti. Everything was fresh and delicious. 80's Aunty never disappoints!",
    product: "Festival Combo",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-2 font-body text-muted-foreground">
            Trusted by families across India
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < t.rating ? "fill-accent text-accent" : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                "{t.text}"
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="font-display text-sm font-semibold text-card-foreground">
                  {t.name}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {t.location} · {t.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
