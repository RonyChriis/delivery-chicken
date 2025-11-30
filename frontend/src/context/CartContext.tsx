/**
 * Cart Context
 * Manejo global del estado del carrito de compras
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';

// Interfaz para items del carrito
export interface CartItem {
    product: Product;
    quantity: number;
}

// Interfaz para el contexto
interface CartContextType {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props del provider
interface CartProviderProps {
    children: ReactNode;
}

// Provider del carrito
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    /**
     * Añadir producto al carrito
     * Si ya existe, incrementa la cantidad
     */
    const addItem = (product: Product): void => {
        setItems(currentItems => {
            const existingItem = currentItems.find(
                item => item.product.id === product.id
            );

            if (existingItem) {
                // Si existe, incrementar cantidad
                return currentItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Si no existe, añadir nuevo item
                return [...currentItems, { product, quantity: 1 }];
            }
        });
    };

    /**
     * Eliminar producto del carrito
     */
    const removeItem = (productId: number): void => {
        setItems(currentItems =>
            currentItems.filter(item => item.product.id !== productId)
        );
    };

    /**
     * Actualizar cantidad de un producto
     */
    const updateQuantity = (productId: number, quantity: number): void => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    /**
     * Vaciar el carrito
     */
    const clearCart = (): void => {
        setItems([]);
    };

    /**
     * Calcular total del carrito
     */
    const getTotal = (): number => {
        return items.reduce((total, item) => {
            const price = parseFloat(item.product.price);
            return total + (price * item.quantity);
        }, 0);
    };

    /**
     * Obtener cantidad total de items
     */
    const getItemCount = (): number => {
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    const value: CartContextType = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Hook personalizado para usar el carrito
 */
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};

export default CartContext;
