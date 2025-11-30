/**
 * Orders Screen
 * Pantalla para mostrar el historial de pedidos del usuario
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrdersStackParamList, Order, OrderStatus } from '../types';
import { getMyOrders } from '../services/ordersService';

type OrdersScreenNavigationProp = NativeStackNavigationProp<OrdersStackParamList, 'OrdersScreen'>;

interface Props {
    navigation: OrdersScreenNavigationProp;
}

const OrdersScreen: React.FC<Props> = ({ navigation }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = async () => {
        try {
            setError(null);
            const data = await getMyOrders();
            setOrders(data);
        } catch (err: any) {
            console.error('Error al cargar pedidos:', err);
            setError(err.response?.data?.message || 'Error al cargar los pedidos');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadOrders();
    }, []);

    const getStatusColor = (status: OrderStatus): string => {
        switch (status) {
            case OrderStatus.PENDING:
                return '#FFA500';
            case OrderStatus.PAID:
                return '#4CAF50';
            case OrderStatus.PREPARING:
                return '#2196F3';
            case OrderStatus.READY_FOR_PICKUP:
                return '#9C27B0';
            case OrderStatus.DELIVERED:
                return '#4CAF50';
            case OrderStatus.CANCELLED:
                return '#F44336';
            default:
                return '#999';
        }
    };

    const getStatusText = (status: OrderStatus): string => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'Pendiente';
            case OrderStatus.PAID:
                return 'Pagado';
            case OrderStatus.PREPARING:
                return 'Preparando';
            case OrderStatus.READY_FOR_PICKUP:
                return 'Listo para Recoger';
            case OrderStatus.DELIVERED:
                return 'Entregado';
            case OrderStatus.CANCELLED:
                return 'Cancelado';
            default:
                return status;
        }
    };

    const renderOrderItem = ({ item }: { item: Order }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>
                    Pedido #{item.orderNumber || item.id}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <Text style={styles.orderDate}>
                    {new Date(item.createdAt).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
                <Text style={styles.orderItems}>
                    {item.items.length} {item.items.length === 1 ? 'producto' : 'productos'}
                </Text>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>S/ {parseFloat(item.totalAmount).toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Cargando pedidos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadOrders}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>No tienes pedidos</Text>
                <Text style={styles.emptyText}>Tus pedidos aparecerán aquí</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B35']} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    listContainer: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    orderDetails: {
        marginBottom: 12,
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    orderItems: {
        fontSize: 14,
        color: '#999',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    totalLabel: {
        fontSize: 14,
        color: '#666',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OrdersScreen;
