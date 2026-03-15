import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrderItem {
    productId: string;
    quantity: bigint;
    price: bigint;
}
export interface Stats {
    totalProducts: bigint;
    totalOrders: bigint;
    pendingOrders: bigint;
    totalRevenue: bigint;
}
export interface Order {
    id: string;
    customerName: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    createdAt: bigint;
    totalAmount: bigint;
    address: string;
    codFee: bigint;
    items: Array<OrderItem>;
    phoneNumber: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    stockQuantity: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    category: string;
    price: bigint;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum PaymentMethod {
    cashOnDelivery = "cashOnDelivery"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(productId: string): Promise<Product | null>;
    getStats(): Promise<Stats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listOrders(): Promise<Array<Order>>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(customerName: string, phoneNumber: string, address: string, items: Array<OrderItem>, paymentMethod: PaymentMethod): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProductsByCategory(category: string): Promise<Array<Product>>;
    searchProductsByName(term: string): Promise<Array<Product>>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
