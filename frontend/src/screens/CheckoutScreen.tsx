/**
 * Checkout Screen
 * Pantalla para confirmar el pedido y seleccionar método de pago
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CartStackParamList, PaymentMethod, OrderType } from '../types';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/ordersService';
import api from '../services/api';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<CartStackParamList, 'Checkout'>;
type CheckoutScreenRouteProp = RouteProp<CartStackParamList, 'Checkout'>;

interface Props {
    navigation: CheckoutScreenNavigationProp;
    route: CheckoutScreenRouteProp;
}

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
    const { items, getTotal, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
    const [orderType, setOrderType] = useState<OrderType>(OrderType.DELIVERY);

    // Dirección
    const [useProfileAddress, setUseProfileAddress] = useState(true);
    const [profileAddress, setProfileAddress] = useState<string | null>(null);
    const [customAddress, setCustomAddress] = useState('');

    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    const total = getTotal();

    useEffect(() => {
        fetchProfileAddress();
    }, []);

    const fetchProfileAddress = async () => {
        try {
            const response = await api.get('/users/me');
            if (response.data && response.data.address) {
                setProfileAddress(response.data.address);
            } else {
                setUseProfileAddress(false); // Si no tiene dirección, forzar manual
            }
        } catch (error) {
            console.error('Error fetching profile address:', error);
            setUseProfileAddress(false);
        } finally {
            setFetchingProfile(false);
        }
    };

    const handleConfirmOrder = async () => {
        const finalAddress = useProfileAddress ? profileAddress : customAddress;

        // Validar dirección si es delivery
        if (orderType === OrderType.DELIVERY && !finalAddress?.trim()) {
            Alert.alert('Error', 'Por favor ingresa una dirección de entrega');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
                paymentMethod,
                orderType,
                deliveryAddress: orderType === OrderType.DELIVERY && finalAddress ? finalAddress : undefined,
            };

            const createdOrder = await createOrder(orderData);

            clearCart();

            Alert.alert(
                '¡Pedido Confirmado!',
                `Tu pedido #${createdOrder.orderNumber || createdOrder.id} ha sido creado exitosamente.\n\nTotal: S/ ${createdOrder.totalAmount}\n\nPuedes ver tus pedidos en la pestaña "Pedidos"`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.popToTop(),
                    },
                ]
            );
        } catch (error: any) {
            console.error('Error al crear pedido:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'No se pudo crear el pedido. Intenta nuevamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Confirmar Pedido</Text>

            {/* Resumen del pedido */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumen</Text>
                {items.map((item) => (
                    <View key={item.product.id} style={styles.itemRow}>
                        <Text style={styles.itemName}>
                            {item.product.name} x{item.quantity}
                        </Text>
                        <Text style={styles.itemPrice}>
                            S/ {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </Text>
                    </View>
                ))}
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalAmount}>S/ {total.toFixed(2)}</Text>
                </View>
            </View>

            {/* Tipo de pedido */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tipo de Pedido</Text>
                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            orderType === OrderType.DELIVERY && styles.optionButtonActive,
                        ]}
                        onPress={() => setOrderType(OrderType.DELIVERY)}>
                        <Text
                            style={[
                                styles.optionText,
                                orderType === OrderType.DELIVERY && styles.optionTextActive,
                            ]}>
                            🚚 Delivery
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            orderType === OrderType.IN_STORE && styles.optionButtonActive,
                        ]}
                        onPress={() => setOrderType(OrderType.IN_STORE)}>
                        <Text
                            style={[
                                styles.optionText,
                                orderType === OrderType.IN_STORE && styles.optionTextActive,
                            ]}>
                            🏪 Recoger en Tienda
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dirección de entrega (solo si es delivery) */}
            {orderType === OrderType.DELIVERY && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dirección de Entrega</Text>

                    {profileAddress && (
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Usar dirección de perfil</Text>
                            <Switch
                                value={useProfileAddress}
                                onValueChange={setUseProfileAddress}
                                trackColor={{ false: "#767577", true: "#FF6B35" }}
                            />
                        </View>
                    )}

                    {useProfileAddress && profileAddress ? (
                        <View style={styles.addressCard}>
                            <Text style={styles.addressText}>{profileAddress}</Text>
                        </View>
                    ) : (
                        <TextInput
                            style={styles.input}
                            placeholder="Ingresa tu dirección completa"
                            value={customAddress}
                            onChangeText={setCustomAddress}
                            multiline
                            numberOfLines={3}
                        />
                    )}
                </View>
            )}

            {/* Método de pago */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Método de Pago</Text>
                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            paymentMethod === PaymentMethod.CASH && styles.optionButtonActive,
                        ]}
                        onPress={() => setPaymentMethod(PaymentMethod.CASH)}>
                        <Text
                            style={[
                                styles.optionText,
                                paymentMethod === PaymentMethod.CASH && styles.optionTextActive,
                            ]}>
                            💵 Efectivo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            paymentMethod === PaymentMethod.CARD && styles.optionButtonActive,
                        ]}
                        onPress={() => setPaymentMethod(PaymentMethod.CARD)}>
                        <Text
                            style={[
                                styles.optionText,
                                paymentMethod === PaymentMethod.CARD && styles.optionTextActive,
                            ]}>
                            💳 Tarjeta
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Botón de confirmar */}
            <TouchableOpacity
                style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
                onPress={handleConfirmOrder}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    itemName: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        marginTop: 8,
        borderTopWidth: 2,
        borderTopColor: '#FF6B35',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    optionButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#DDD',
        alignItems: 'center',
    },
    optionButtonActive: {
        borderColor: '#FF6B35',
        backgroundColor: '#FFF5F2',
    },
    optionText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    optionTextActive: {
        color: '#FF6B35',
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        backgroundColor: '#FFF',
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
    addressCard: {
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    addressText: {
        fontSize: 14,
        color: '#333',
    },
    confirmButton: {
        backgroundColor: '#FF6B35',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 32,
    },
    confirmButtonDisabled: {
        backgroundColor: '#CCC',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;
