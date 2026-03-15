import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";

export default function ProductCard({
  product,
  index,
}: { product: Product; index: number }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const imgSrc =
    product.imageUrl || "/assets/generated/book-fiction.dim_400x300.jpg";

  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      data-ocid={`products.item.${index}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-xs hover:shadow-book transition-shadow duration-300 border border-border"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/generated/book-fiction.dim_400x300.jpg";
          }}
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">
          {product.category}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ₹{product.price.toString()}
          </span>
          {product.isAvailable ? (
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
              data-ocid={`products.cart.button.${index}`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" /> Add
            </Button>
          ) : (
            <Button size="sm" disabled>
              Unavailable
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
