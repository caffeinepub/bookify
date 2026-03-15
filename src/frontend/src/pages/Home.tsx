import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Star, Truck } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useListProducts } from "../hooks/useQueries";

const CATEGORIES = [
  "Fiction",
  "Science",
  "Self-Help",
  "Children",
  "History",
  "Technology",
];

const SKELETONS = ["s1", "s2", "s3", "s4", "s5", "s6"];

export default function Home() {
  const { data: products, isLoading } = useListProducts();
  const featured = products?.filter((p) => p.isAvailable).slice(0, 6) ?? [];

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent font-semibold text-sm tracking-wider uppercase mb-3">
              Welcome to Bookify
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Discover Your Next
              <span className="text-accent"> Great Read</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-md">
              Thousands of books at your fingertips. From timeless classics to
              modern masterpieces — find stories that move you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" data-ocid="hero.browse.button">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  Browse Books <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <img
              src="/assets/generated/bookify-hero.dim_1200x600.jpg"
              alt="Books collection"
              className="rounded-2xl shadow-2xl w-full object-cover max-h-96"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-secondary border-y border-border">
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-3 py-2">
            <Truck className="h-6 w-6 text-accent" />
            <div className="text-left">
              <p className="font-semibold text-sm">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">
                ₹40 COD fee on all orders
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 py-2">
            <BookOpen className="h-6 w-6 text-accent" />
            <div className="text-left">
              <p className="font-semibold text-sm">Wide Selection</p>
              <p className="text-xs text-muted-foreground">
                All genres & categories
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 py-2">
            <Star className="h-6 w-6 text-accent" />
            <div className="text-left">
              <p className="font-semibold text-sm">Curated Picks</p>
              <p className="text-xs text-muted-foreground">
                Handpicked bestsellers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-3xl font-bold text-foreground mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <a
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              data-ocid={`category.item.${i + 1}`}
              className="bg-card border border-border rounded-lg p-4 text-center hover:border-accent hover:shadow-xs transition-all group"
            >
              <span className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                {cat}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Featured Books
          </h2>
          <Link
            to="/products"
            data-ocid="home.viewall.link"
            className="text-sm text-accent font-semibold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="products.loading_state"
          >
            {SKELETONS.map((k) => (
              <Skeleton key={k} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div
            data-ocid="products.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No books available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i + 1} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
