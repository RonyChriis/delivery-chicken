/**
 * Products Service
 * Servicio para consumir los endpoints de productos
 */

import api from './api';
import { Product } from '../types';

/**
 * Obtener todos los productos
 */
export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get<Product[]>('/products');
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id: number): Promise<Product> => {
    try {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener producto:', error);
        throw error;
    }
};

export default {
    getProducts,
    getProductById,
};
