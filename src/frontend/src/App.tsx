import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import OrderSuccess from "./pages/OrderSuccess";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";

function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <Outlet />
      <Toaster />
    </CartProvider>
  ),
});

// Storefront layout route
const storefrontRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "storefront",
  component: StorefrontLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/",
  component: Home,
});

const productsRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/products",
  component: Products,
});

const productDetailRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/products/$id",
  component: ProductDetail,
});

const cartRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/cart",
  component: Cart,
});

const checkoutRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/checkout",
  component: Checkout,
});

const orderSuccessRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/order-success",
  component: OrderSuccess,
});

// Admin routes
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLogin,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/dashboard",
  component: AdminDashboard,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/products",
  component: AdminProducts,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/orders",
  component: AdminOrders,
});

const routeTree = rootRoute.addChildren([
  storefrontRoute.addChildren([
    homeRoute,
    productsRoute,
    productDetailRoute,
    cartRoute,
    checkoutRoute,
    orderSuccessRoute,
  ]),
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminOrdersRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
