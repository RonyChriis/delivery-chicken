/**
 * API Service
 * Configuración de axios con interceptores y manejo de autenticación
 */

import axios, { AxiosError } from 'axios';
import { API_URL } from '../config/api';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Función para establecer el token de autenticación
 * @param token - Token de Firebase
 */
export const setAuthToken = (token: string | null): void => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Interceptor de respuestas para manejo de errores
api.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa, simplemente retornarla
        return response;
    },
    (error: AxiosError) => {
        // Manejo de errores de la API
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    console.error('Error 401: No autorizado. Token inválido o expirado.');
                    // Aquí podrías agregar lógica para cerrar sesión automáticamente
                    break;
                case 403:
                    console.error('Error 403: Acceso prohibido. No tienes permisos.');
                    break;
                case 404:
                    console.error('Error 404: Recurso no encontrado.');
                    break;
                case 500:
                    console.error('Error 500: Error interno del servidor.');
                    break;
                default:
                    console.error(`Error ${status}:`, (data as any)?.message || 'Error desconocido');
            }
        } else if (error.request) {
            console.error('Error de red: No se pudo conectar con el servidor.');
        } else {
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
