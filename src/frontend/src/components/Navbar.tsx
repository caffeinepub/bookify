import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <BookOpen className="h-6 w-6 text-accent" />
          <span className="font-display text-2xl font-bold text-primary">
            Bookify
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            data-ocid="nav.home.link"
            className={`text-sm font-medium transition-colors hover:text-accent ${isActive("/") ? "text-accent" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          <Link
            to="/products"
            data-ocid="nav.products.link"
            className={`text-sm font-medium transition-colors hover:text-accent ${isActive("/products") ? "text-accent" : "text-muted-foreground"}`}
          >
            Books
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" data-ocid="nav.cart.link" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground">
                {itemCount}
              </Badge>
            )}
          </Link>

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-card border-t border-border px-4 py-3 flex flex-col gap-3">
          <Link
            to="/"
            data-ocid="mobile.nav.home.link"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-foreground"
          >
            Home
          </Link>
          <Link
            to="/products"
            data-ocid="mobile.nav.products.link"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-foreground"
          >
            Books
          </Link>
        </div>
      )}
    </header>
  );
}
