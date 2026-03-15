# Bookify

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public storefront to browse and purchase books/products
- Product listing page with name, description, price, image
- Product detail page
- Shopping cart with item management
- Checkout flow with Cash on Delivery (COD) option; COD adds ₹40 extra charge
- Order placement with customer name, phone, delivery address
- Admin panel (login-protected) to manage:
  - Products: add, edit, delete, toggle availability, upload images
  - Orders: view all orders, update order status (Pending, Confirmed, Shipped, Delivered, Cancelled)
  - Dashboard: summary stats (total orders, revenue, pending orders)
- Role-based access: admin vs public user
- Blob storage for product images

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Product CRUD, Order management, Admin role check, COD fee logic
2. Frontend: Storefront (home, product list, product detail, cart, checkout), Admin panel (dashboard, products, orders)
3. Authorization for admin-only routes
4. Blob storage for product image uploads
5. COD surcharge of ₹40 applied at checkout
