import { BookOpen } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-accent" />
              <span className="font-display text-xl font-bold">Bookify</span>
            </div>
            <p className="text-sm opacity-70">
              Your ultimate destination for books. Discover stories that
              inspire, educate, and entertain.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <a href="/" className="hover:opacity-100">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:opacity-100">
                  Browse Books
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:opacity-100">
                  Cart
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Delivery Info</h4>
            <p className="text-sm opacity-70">
              We offer Cash on Delivery across India. A ₹40 COD handling fee
              applies to all orders.
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-60">
          © {year}. Built with ❤️ using{" "}
          <a
            href={utmLink}
            className="underline hover:opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
