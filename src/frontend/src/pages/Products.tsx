import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useListProducts } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Fiction",
  "Science",
  "Self-Help",
  "Children",
  "History",
  "Technology",
];

const SKELETONS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

export default function Products() {
  // Read category from URL search params directly
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const urlCat = urlParams.get("category") ?? "All";
  const [searchText, setSearchText] = useState("");

  const { data: products, isLoading } = useListProducts();

  const filtered = useMemo(() => {
    return (products ?? []).filter((p) => {
      const matchCat = urlCat === "All" || p.category === urlCat;
      const matchSearch =
        !searchText || p.name.toLowerCase().includes(searchText.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, urlCat, searchText]);

  const handleCategoryChange = (cat: string) => {
    if (cat === "All") {
      navigate({ to: "/products" });
    } else {
      navigate({ to: "/products", search: { category: cat } as never });
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-bold text-foreground mb-2">
        All Books
      </h1>
      <p className="text-muted-foreground mb-8">
        Explore our complete collection
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="products.search_input"
            placeholder="Search books..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid="products.category.tab"
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              urlCat === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-accent hover:text-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-ocid="products.loading_state"
        >
          {SKELETONS.map((k) => (
            <Skeleton key={k} className="h-72" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="products.empty_state"
          className="text-center py-24 text-muted-foreground"
        >
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-semibold">No books found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i + 1} />
          ))}
        </div>
      )}
    </main>
  );
}
