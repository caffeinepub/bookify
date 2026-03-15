import { Button } from "@/components/ui/button";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  BookOpen,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsAdmin } from "../../hooks/useQueries";

export default function AdminLayout() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const { clear, identity } = useInternetIdentity();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && identity && isAdmin === false) {
      navigate({ to: "/admin" });
    }
    if (!isLoading && !identity) {
      navigate({ to: "/admin" });
    }
  }, [isAdmin, isLoading, identity, navigate]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.error_state"
      >
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">
            You do not have admin privileges.
          </p>
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      to: "/admin/dashboard" as const,
      icon: LayoutDashboard,
      label: "Dashboard",
      ocid: "admin.nav.dashboard.link",
    },
    {
      to: "/admin/products" as const,
      icon: Package,
      label: "Products",
      ocid: "admin.nav.products.link",
    },
    {
      to: "/admin/orders" as const,
      icon: ShoppingBag,
      label: "Orders",
      ocid: "admin.nav.orders.link",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="px-6 py-5 border-b border-sidebar-border flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-sidebar-primary" />
          <span className="font-display text-xl font-bold">Bookify Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={item.ocid}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={clear}
            data-ocid="admin.logout.button"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-8 bg-background overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
