/**
 * Mock Data
 * Datos de prueba para desarrollo y testing
 */

import { Product } from '../types';

export const PRODUCTS_MOCK: Product[] = [
    {
        id: 1,
        name: 'Pollo a la Brasa',
        description: 'Delicioso pollo entero marinado con nuestras especias secretas y horneado lentamente en leña.',
        price: '59.90',
        isAvailable: true,
        imageUrl: 'https://res.cloudinary.com/dnm9wqem5/image/upload/v1763920963/pollobrasa_ti5l2x.jpg',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
        id: 2,
        name: '1/4 de Pollo',
        description: 'Perfecto para una porción individual. Acompañado de papas fritas y ensalada.',
        price: '24.00',
        isAvailable: true,
        imageUrl: 'https://res.cloudinary.com/dnm9wqem5/image/upload/v1763921592/POLLO-BROASTHER_xa2cvz.webp',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
        id: 3,
        name: 'Papas Fritas Grandes',
        description: 'Crujientes por fuera, suaves y esponjosas por dentro. La guarnición perfecta.',
        price: '12.50',
        isAvailable: true,
        imageUrl: 'https://via.placeholder.com/300x200/FFD700/000000?text=Papas+Fritas',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
        id: 4,
        name: 'Inca Kola 500ml',
        description: 'El sabor tradicional del Perú en su presentación más clásica. Bien fría.',
        price: '5.50',
        isAvailable: true,
        imageUrl: 'https://via.placeholder.com/300x200/FFD700/000000?text=Inca+Kola',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
    },
] as Product[];
