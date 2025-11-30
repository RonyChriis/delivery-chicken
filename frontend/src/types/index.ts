/**
 * Type Definitions
 * Interfaces y tipos basados en las entidades del backend
 */

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    PREPARING = 'PREPARING',
    READY_FOR_PICKUP = 'READY_FOR_PICKUP',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
}

export enum OrderType {
    DELIVERY = 'DELIVERY',
    IN_STORE = 'IN_STORE',
}

export interface User {
    id: number;
    firebaseUid: string;
    email: string;
    name: string;
    phone: string | null;
    address: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    isAvailable: boolean;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: number;
    quantity: number;
    priceAtTime: string;
    product: Product;
}

export interface Order {
    id: number;
    orderNumber: string | null;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    orderType: OrderType;
    totalAmount: string;
    deliveryAddress: string | null;
    items: OrderItem[];
    user: User;
    createdAt: string;
}

export interface CreateOrderDto {
    items: {
        productId: number;
        quantity: number;
    }[];
    paymentMethod: PaymentMethod;
    orderType: OrderType;
    deliveryAddress?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
}

// Navigation Types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Cart: undefined;
    Orders: undefined;
    Profile: undefined;
};

export type HomeStackParamList = {
    HomeScreen: undefined;
    ProductDetails: { productId: number };
};

export type CartStackParamList = {
    CartScreen: undefined;
    Checkout: undefined;
};

export type OrdersStackParamList = {
    OrdersScreen: undefined;
    OrderDetails: { orderId: number };
};
