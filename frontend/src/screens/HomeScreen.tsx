/**
 * Home Screen
 * Pantalla principal con lista de productos desde API real
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, Product } from '../types';
import productsService from '../services/productsService';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    /**
     * Cargar productos desde la API real
     */
    const loadProducts = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await productsService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('No se pudieron cargar los productos');
            Alert.alert(
                'Error',
                'No se pudieron cargar los productos. Verifica que el backend esté corriendo en http://localhost:3000',
                [
                    { text: 'Reintentar', onPress: loadProducts },
                    { text: 'Cancelar', style: 'cancel' }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Filtrar productos por búsqueda
     */
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * Navegar a detalles del producto
     */
    const handleProductPress = (productId: number): void => {
        navigation.navigate('ProductDetails', { productId });
    };

    /**
     * Renderizar un producto individual
     */
    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item.id)}>
            <View style={styles.productImageContainer}>
                <Image
                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>S/ {parseFloat(item.price).toFixed(2)}</Text>
                    <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: item.isAvailable ? '#4ECDC4' : '#FF6B6B' }
                    ]}>
                        <Text style={styles.availabilityText}>
                            {item.isAvailable ? 'Disponible' : 'Agotado'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
        );
    }

    if (error && products.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>😕</Text>
                <Text style={styles.errorMessage}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>¡Bienvenido a Villa Chicken!</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar productos..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
                        </Text>
                    </View>
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
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorMessage: {
        fontSize: 16,
        color: '#666',
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
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#FFF',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    listContainer: {
        padding: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    productCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 10,
        margin: 5,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#F0F0F0',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    productDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    availabilityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
    availabilityText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});

export default HomeScreen;