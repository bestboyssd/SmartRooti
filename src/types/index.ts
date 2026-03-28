// src/types/index.ts

// Product interface
export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
}

// Cart interface
export interface Cart {
    items: Array<{ product: Product; quantity: number; }>
    total: number;
}

// Order interface
export interface Order {
    id: string;
    cart: Cart;
    createdAt: Date;
    status: 'pending' | 'completed' | 'canceled';
}