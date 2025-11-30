/**
 * Cart Screen
 * Pantalla del carrito de compras con funcionalidad completa
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParamList } from '../types';
import { useCart, CartItem } from '../context/CartContext';

type CartScreenNavigationProp = NativeStackNavigationProp<CartStackParamList, 'CartScreen'>;

interface Props {
    navigation: CartScreenNavigationProp;
}

const CartScreen: React.FC<Props> = ({ navigation }) => {
    const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart();


    /**
     * Confirmar eliminación de item
     */
    const handleRemoveItem = (productId: number, productName: string): void => {
        Alert.alert(
            'Eliminar producto',
            `¿Deseas eliminar ${productName} del carrito?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => removeItem(productId)
                }
            ]
        );
    };

    /**
     * Incrementar cantidad
     */
    const handleIncrement = (productId: number, currentQuantity: number): void => {
        updateQuantity(productId, currentQuantity + 1);
    };

    /**
     * Decrementar cantidad
     */
    const handleDecrement = (productId: number, currentQuantity: number): void => {
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1);
        } else {
            // Si la cantidad es 1, preguntar si desea eliminar
            const item = items.find(i => i.product.id === productId);
            if (item) {
                handleRemoveItem(productId, item.product.name);
            }
        }
    };

    /**
     * Vaciar carrito
     */
    const handleClearCart = (): void => {
        Alert.alert(
            'Vaciar carrito',
            '¿Estás seguro de que deseas vaciar el carrito?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Vaciar',
                    style: 'destructive',
                    onPress: () => clearCart()
                }
            ]
        );
    };

    /**
     * Navegar a Checkout
     */
    const handleConfirmOrder = (): void => {
        navigation.navigate('Checkout');
    };

    /**
     * Renderizar item del carrito
     */
    const renderCartItem = ({ item }: { item: CartItem }) => {
        const subtotal = parseFloat(item.product.price) * item.quantity;

        return (
            <View style={styles.cartItem}>
                <Image
                    source={{ uri: item.product.imageUrl || 'https://via.placeholder.com/80' }}
                    style={styles.itemImage}
                    resizeMode="cover"
                />

                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <Text style={styles.itemPrice}>S/ {parseFloat(item.product.price).toFixed(2)}</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleDecrement(item.product.id, item.quantity)}>
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleIncrement(item.product.id, item.quantity)}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.itemRight}>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveItem(item.product.id, item.product.name)}>
                        <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.subtotal}>S/ {subtotal.toFixed(2)}</Text>
                </View>
            </View>
        );
    };

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🛒</Text>
                <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
                <Text style={styles.emptyText}>Agrega productos para comenzar tu pedido</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Carrito</Text>
                <Text style={styles.headerSubtitle}>{getItemCount()} {getItemCount() === 1 ? 'producto' : 'productos'}</Text>
                {items.length > 0 && (
                    <TouchableOpacity onPress={handleClearCart}>
                        <Text style={styles.clearButton}>Vaciar carrito</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Lista de items */}
            <FlatList
                data={items}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.product.id.toString()}
                contentContainerStyle={styles.listContainer}
            />

            {/* Footer con total y botón */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>S/ {getTotal().toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmOrder}>
                    <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#FFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    clearButton: {
        color: '#FF6B6B',
        fontSize: 14,
        marginTop: 8,
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 14,
        color: '#666',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantityButton: {
        width: 28,
        height: 28,
        backgroundColor: '#FF6B35',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 12,
    },
    itemRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    removeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFE5E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    footer: {
        backgroundColor: '#FFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    confirmButton: {
        backgroundColor: '#4ECDC4',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CartScreen;
