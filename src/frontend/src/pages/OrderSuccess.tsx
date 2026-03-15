import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function OrderSuccess() {
  return (
    <main
      className="container mx-auto px-4 py-20 text-center"
      data-ocid="order.success_state"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
      </motion.div>
      <h1 className="font-display text-4xl font-bold text-foreground mb-3">
        Order Placed!
      </h1>
      <p className="text-muted-foreground text-lg mb-2">
        Thank you for shopping with Bookify.
      </p>
      <p className="text-muted-foreground mb-8">
        Your books will be delivered soon. Pay ₹ on delivery.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/" data-ocid="order.home.link">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </main>
  );
}
