/**
 * Order Details Screen
 * Pantalla para ver los detalles completos de un pedido
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OrdersStackParamList, Order, OrderStatus, PaymentMethod, OrderType } from '../types';
import { getOrderById, cancelOrder } from '../services/ordersService';

type OrderDetailsScreenNavigationProp = NativeStackNavigationProp<OrdersStackParamList, 'OrderDetails'>;
type OrderDetailsScreenRouteProp = RouteProp<OrdersStackParamList, 'OrderDetails'>;

interface Props {
    navigation: OrderDetailsScreenNavigationProp;
    route: OrderDetailsScreenRouteProp;
}

const OrderDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
    const { orderId } = route.params;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        loadOrderDetails();
    }, [orderId]);

    const loadOrderDetails = async () => {
        try {
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (error: any) {
            console.error('Error al cargar detalles del pedido:', error);
            Alert.alert('Error', 'No se pudo cargar el pedido');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = () => {
        if (!order) return;

        Alert.alert(
            'Cancelar Pedido',
            `¿Estás seguro de que deseas cancelar el pedido #${order.orderNumber || order.id}?`,
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, Cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        setCancelling(true);
                        try {
                            await cancelOrder(order.id);
                            Alert.alert('Éxito', 'Pedido cancelado correctamente');
                            navigation.goBack();
                        } catch (error: any) {
                            Alert.alert(
                                'Error',
                                error.response?.data?.message || 'No se pudo cancelar el pedido'
                            );
                        } finally {
                            setCancelling(false);
                        }
                    },
                },
            ]
        );
    };

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

    const getPaymentMethodText = (method: PaymentMethod): string => {
        return method === PaymentMethod.CASH ? '💵 Efectivo' : '💳 Tarjeta';
    };

    const getOrderTypeText = (type: OrderType): string => {
        return type === OrderType.DELIVERY ? '🚚 Delivery' : '🏪 Recoger en Tienda';
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Cargando detalles...</Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Pedido no encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.orderNumber}>Pedido #{order.orderNumber || order.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                </View>
            </View>

            {/* Información del pedido */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha:</Text>
                    <Text style={styles.infoValue}>
                        {new Date(order.createdAt).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tipo:</Text>
                    <Text style={styles.infoValue}>{getOrderTypeText(order.orderType)}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Pago:</Text>
                    <Text style={styles.infoValue}>{getPaymentMethodText(order.paymentMethod)}</Text>
                </View>
                {order.deliveryAddress && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Dirección:</Text>
                        <Text style={styles.infoValue}>{order.deliveryAddress}</Text>
                    </View>
                )}
            </View>

            {/* Productos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Productos</Text>
                {order.items.map((item, index) => (
                    <View key={index} style={styles.productCard}>
                        <Image
                            source={{ uri: item.product.imageUrl }}
                            style={styles.productImage}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.product.name}</Text>
                            <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
                            <Text style={styles.productPrice}>
                                S/ {parseFloat(item.priceAtTime).toFixed(2)} c/u
                            </Text>
                        </View>
                        <Text style={styles.productTotal}>
                            S/ {(parseFloat(item.priceAtTime) * item.quantity).toFixed(2)}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>S/ {parseFloat(order.totalAmount).toFixed(2)}</Text>
            </View>

            {/* Botón de cancelar (solo si está PENDING) */}
            {order.status === OrderStatus.PENDING && (
                <TouchableOpacity
                    style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]}
                    onPress={handleCancelOrder}
                    disabled={cancelling}>
                    {cancelling ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
                    )}
                </TouchableOpacity>
            )}

            <View style={{ height: 32 }} />
        </ScrollView>
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
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
    },
    header: {
        backgroundColor: '#FFF',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    orderNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    statusText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#FFF',
        marginTop: 16,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    productCard: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    productQuantity: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    productPrice: {
        fontSize: 12,
        color: '#999',
    },
    productTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF6B35',
        alignSelf: 'center',
    },
    totalSection: {
        backgroundColor: '#FFF',
        marginTop: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    cancelButton: {
        backgroundColor: '#F44336',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonDisabled: {
        backgroundColor: '#CCC',
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderDetailsScreen;
