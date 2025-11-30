/**
 * Orders Service
 * Servicio para consumir los endpoints de pedidos
 */

import api from './api';
import { Order, CreateOrderDto } from '../types';

/**
 * Crear un nuevo pedido
 */
export const createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
    try {
        const response = await api.post<Order>('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error al crear pedido:', error);
        throw error;
    }
};

/**
 * Obtener todos los pedidos del usuario autenticado
 */
export const getMyOrders = async (): Promise<Order[]> => {
    try {
        const response = await api.get<Order[]>('/orders');
        return response.data;
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        throw error;
    }
};

/**
 * Obtener un pedido por ID
 */
export const getOrderById = async (id: number): Promise<Order> => {
    try {
        const response = await api.get<Order>(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener pedido:', error);
        throw error;
    }
};

/**
 * Cancelar un pedido (solo si está en estado PENDING)
 */
export const cancelOrder = async (id: number): Promise<Order> => {
    try {
        const response = await api.delete<Order>(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al cancelar pedido:', error);
        throw error;
    }
};

export default {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
};
