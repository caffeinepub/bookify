import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: bigint;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  subtotal: bigint;
  codFee: bigint;
  total: bigint;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const COD_FEE = BigInt(40);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("bookify_cart");
      if (!stored) return [];
      const parsed = JSON.parse(stored) as Array<{
        productId: string;
        name: string;
        price: string;
        quantity: number;
        imageUrl: string;
      }>;
      return parsed.map((i) => ({ ...i, price: BigInt(i.price) }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const serializable = items.map((i) => ({
      ...i,
      price: i.price.toString(),
    }));
    localStorage.setItem("bookify_cart", JSON.stringify(serializable));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce(
    (acc, i) => acc + i.price * BigInt(i.quantity),
    BigInt(0),
  );
  const codFee = items.length > 0 ? COD_FEE : BigInt(0);
  const total = subtotal + codFee;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        subtotal,
        codFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
