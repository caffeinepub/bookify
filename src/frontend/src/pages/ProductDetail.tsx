import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useGetProduct } from "../hooks/useQueries";

export default function ProductDetail() {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params.id ?? "";
  const { data: product, isLoading } = useGetProduct(id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-10"
        data-ocid="product.loading_state"
      >
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="product.error_state"
      >
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Link to="/products">
          <Button className="mt-4" variant="outline">
            Back to Books
          </Button>
        </Link>
      </div>
    );
  }

  const imgSrc =
    product.imageUrl || "/assets/generated/book-fiction.dim_400x300.jpg";

  return (
    <main className="container mx-auto px-4 py-10">
      <Link
        to="/products"
        data-ocid="product.back.link"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Books
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="rounded-2xl overflow-hidden shadow-book aspect-[4/3]">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/generated/book-fiction.dim_400x300.jpg";
            }}
          />
        </div>

        <div>
          <Badge className="mb-3 bg-accent text-accent-foreground">
            {product.category}
          </Badge>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-primary mb-4">
            ₹{product.price.toString()}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Package className="h-4 w-4" />
            <span>Stock: {product.stockQuantity.toString()} available</span>
          </div>

          {product.isAvailable ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-md">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleAdd}
                data-ocid="product.cart.button"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </div>
          ) : (
            <Button size="lg" disabled className="w-full">
              Out of Stock
            </Button>
          )}

          <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm font-medium text-foreground">
              🚚 Cash on Delivery Available
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              ₹40 COD fee will be added at checkout
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
