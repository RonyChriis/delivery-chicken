/**
 * Product Details Screen
 * Pantalla de detalles del producto con integración de carrito
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList, Product } from '../types';
import productsService from '../services/productsService';
import { useCart } from '../context/CartContext';

type ProductDetailsScreenNavigationProp = NativeStackNavigationProp<
    HomeStackParamList,
    'ProductDetails'
>;
type ProductDetailsScreenRouteProp = RouteProp<HomeStackParamList, 'ProductDetails'>;

interface Props {
    navigation: ProductDetailsScreenNavigationProp;
    route: ProductDetailsScreenRouteProp;
}

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);

    const { addItem } = useCart();

    useEffect(() => {
        loadProduct();
    }, [productId]);

    /**
     * Cargar detalles del producto desde la API
     */
    const loadProduct = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await productsService.getProductById(productId);
            setProduct(data);
        } catch (error) {
            console.error('Error al cargar producto:', error);
            Alert.alert(
                'Error',
                'No se pudo cargar el producto. Por favor intenta de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Incrementar cantidad
     */
    const incrementQuantity = (): void => {
        setQuantity(prev => prev + 1);
    };

    /**
     * Decrementar cantidad
     */
    const decrementQuantity = (): void => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    /**
     * Agregar al carrito
     */
    const handleAddToCart = (): void => {
        if (!product) return;

        // Añadir el producto al carrito la cantidad de veces especificada
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }

        Alert.alert(
            '¡Agregado!',
            `${quantity} x ${product.name} agregado al carrito`,
            [
                { text: 'Seguir comprando', style: 'cancel' },
                {
                    text: 'Ver carrito',
                    onPress: () => navigation.navigate('HomeScreen')
                }
            ]
        );

        // Resetear cantidad
        setQuantity(1);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Cargando producto...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Producto no encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: product.imageUrl || 'https://via.placeholder.com/400' }}
                style={styles.productImage}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <Text style={styles.productName}>{product.name}</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>S/ {parseFloat(product.price).toFixed(2)}</Text>
                    <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: product.isAvailable ? '#4ECDC4' : '#FF6B6B' }
                    ]}>
                        <Text style={styles.availabilityText}>
                            {product.isAvailable ? 'Disponible' : 'Agotado'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.productDescription}>{product.description}</Text>

                {product.isAvailable && (
                    <>
                        <Text style={styles.sectionTitle}>Cantidad</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={decrementQuantity}>
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>

                            <Text style={styles.quantityText}>{quantity}</Text>

                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={incrementQuantity}>
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={handleAddToCart}>
                            <Text style={styles.addToCartButtonText}>
                                Agregar al Carrito - S/ {(parseFloat(product.price) * quantity).toFixed(2)}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {!product.isAvailable && (
                    <View style={styles.unavailableContainer}>
                        <Text style={styles.unavailableText}>
                            Este producto no está disponible en este momento
                        </Text>
                    </View>
                )}
            </View>
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
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#999',
    },
    productImage: {
        width: '100%',
        height: 300,
        backgroundColor: '#F0F0F0',
    },
    content: {
        padding: 20,
        backgroundColor: '#FFF',
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    productPrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    availabilityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
    },
    availabilityText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    productDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    quantityButton: {
        width: 50,
        height: 50,
        backgroundColor: '#FF6B35',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 30,
    },
    addToCartButton: {
        backgroundColor: '#4ECDC4',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    addToCartButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    unavailableContainer: {
        backgroundColor: '#FFE5E5',
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
    },
    unavailableText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ProductDetailsScreen;
