/**
 * Main Tab Navigator
 * Navegación principal con tabs para la aplicación
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MainTabParamList, HomeStackParamList, CartStackParamList, OrdersStackParamList } from '../types';
import { useCart } from '../context/CartContext';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CartStack = createNativeStackNavigator<CartStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();

// Stack Navigator para Home (incluye ProductDetails)
const HomeStackNavigator: React.FC = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ title: 'Villa Chicken' }}
            />
            <HomeStack.Screen
                name="ProductDetails"
                component={ProductDetailsScreen}
                options={{ title: 'Detalles del Producto' }}
            />
        </HomeStack.Navigator>
    );
};

// Stack Navigator para Cart (incluye Checkout)
const CartStackNavigator: React.FC = () => {
    return (
        <CartStack.Navigator>
            <CartStack.Screen
                name="CartScreen"
                component={CartScreen}
                options={{ title: 'Mi Carrito' }}
            />
            <CartStack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ title: 'Confirmar Pedido' }}
            />
        </CartStack.Navigator>
    );
};

// Stack Navigator para Orders (incluye OrderDetails)
const OrdersStackNavigator: React.FC = () => {
    return (
        <OrdersStack.Navigator>
            <OrdersStack.Screen
                name="OrdersScreen"
                component={OrdersScreen}
                options={{ title: 'Mis Pedidos' }}
            />
            <OrdersStack.Screen
                name="OrderDetails"
                component={OrderDetailsScreen}
                options={{ title: 'Detalles del Pedido' }}
            />
        </OrdersStack.Navigator>
    );
};

const MainTabNavigator: React.FC = () => {
    const { getItemCount } = useCart();
    const itemCount = getItemCount();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'shopping-cart' : 'shopping-cart';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'receipt' : 'receipt-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else {
                        iconName = 'help-outline';
                    }

                    // Mostrar badge en el carrito si hay items
                    if (route.name === 'Cart' && itemCount > 0) {
                        return (
                            <View style={styles.iconWrapper}>
                                <Icon name={iconName} size={size} color={color} />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{itemCount}</Text>
                                </View>
                            </View>
                        );
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FF6B35',
                tabBarInactiveTintColor: '#9E9E9E',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarIconStyle: {
                    marginTop: 4,
                },
            })}>
            <Tab.Screen
                name="Home"
                component={HomeStackNavigator}
                options={{ title: 'Inicio' }}
            />
            <Tab.Screen
                name="Cart"
                component={CartStackNavigator}
                options={{ title: 'Carrito' }}
            />
            <Tab.Screen
                name="Orders"
                component={OrdersStackNavigator}
                options={{ title: 'Pedidos' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Perfil' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconWrapper: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -6,
        top: -3,
        backgroundColor: '#FF6B35',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default MainTabNavigator;
