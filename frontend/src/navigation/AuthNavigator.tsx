/**
 * Auth Navigator
 * Navegación con splash screen y CartProvider
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { CartProvider } from '../context/CartContext';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';

import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator: React.FC = () => {
    const { user, loading } = useAuth();
    const [showSplash, setShowSplash] = useState<boolean>(true);

    if (showSplash || loading) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
        <CartProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    {user ? (
                        <Stack.Screen name="Main" component={MainTabNavigator} />
                    ) : (
                        <>
                            <Stack.Screen name="Auth" component={AuthScreen} />
                            <Stack.Screen name="Register" component={RegisterScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </CartProvider>
    );
};

export default AuthNavigator;
