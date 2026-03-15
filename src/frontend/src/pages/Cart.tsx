import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, codFee, total } = useCart();

  if (items.length === 0) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h2 className="font-display text-2xl font-bold mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-6">
          Add some books to get started
        </p>
        <Link to="/products" data-ocid="cart.browse.button">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Browse Books
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <div
              key={item.productId}
              data-ocid={`cart.item.${i + 1}`}
              className="bg-card border border-border rounded-xl p-4 flex gap-4"
            >
              <img
                src={
                  item.imageUrl ||
                  "/assets/generated/book-fiction.dim_400x300.jpg"
                }
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/generated/book-fiction.dim_400x300.jpg";
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-primary font-bold mt-1">
                  ₹{item.price.toString()}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      type="button"
                      onClick={() =>
                        updateQty(item.productId, item.quantity - 1)
                      }
                      className="px-3 py-1 text-sm hover:bg-muted transition-colors"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQty(item.productId, item.quantity + 1)
                      }
                      className="px-3 py-1 text-sm hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    = ₹{(item.price * BigInt(item.quantity)).toString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                data-ocid={`cart.delete_button.${i + 1}`}
                className="text-muted-foreground hover:text-destructive transition-colors self-start mt-1"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <div
          className="bg-card border border-border rounded-xl p-6 h-fit sticky top-20"
          data-ocid="cart.panel"
        >
          <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toString()}</span>
            </div>
            <div className="flex justify-between text-amber-600">
              <span className="font-medium">Cash on Delivery Fee</span>
              <span className="font-medium">+₹{codFee.toString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toString()}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 mb-5 bg-accent/10 rounded p-2">
            ₹40 COD handling fee is added for cash on delivery orders
          </p>
          <Link to="/checkout" data-ocid="cart.checkout.button">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
