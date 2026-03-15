import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentMethod } from "../backend.d";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useQueries";

export default function Checkout() {
  const { items, subtotal, codFee, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});
  const navigate = useNavigate();
  const placeOrder = usePlaceOrder();

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      e.phone = "Valid 10-digit phone required";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      await placeOrder.mutateAsync({
        customerName: form.name,
        phoneNumber: form.phone,
        address: form.address,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: BigInt(i.quantity),
          price: i.price,
        })),
        paymentMethod: PaymentMethod.cashOnDelivery,
      });
      clearCart();
      navigate({ to: "/order-success" });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-6"
          data-ocid="checkout.panel"
        >
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-5">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  data-ocid="checkout.name.input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p
                    data-ocid="checkout.name.error_state"
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  data-ocid="checkout.phone.input"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p
                    data-ocid="checkout.phone.error_state"
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  data-ocid="checkout.address.textarea"
                  placeholder="Enter your full delivery address"
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p
                    data-ocid="checkout.address.error_state"
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 flex gap-4">
            <Truck className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Cash on Delivery</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pay ₹{total.toString()} in cash when your order arrives. A ₹40
                COD handling fee is included.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={placeOrder.isPending}
            data-ocid="checkout.submit_button"
          >
            {placeOrder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing
                Order...
              </>
            ) : (
              `Place Order • ₹${total.toString()}`
            )}
          </Button>
        </form>

        <div
          className="bg-card border border-border rounded-xl p-6 h-fit"
          data-ocid="checkout.summary.panel"
        >
          <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground line-clamp-1 flex-1 pr-2">
                  {item.name} ×{item.quantity}
                </span>
                <span className="font-medium">
                  ₹{(item.price * BigInt(item.quantity)).toString()}
                </span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2 mt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toString()}</span>
            </div>
            <div className="flex justify-between text-amber-600 font-medium">
              <span>COD Fee</span>
              <span>+₹{codFee.toString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₹{total.toString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
