/**
 * Register Screen
 * Pantalla de registro de usuario
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import api, { setAuthToken } from '../services/api';
import auth from '@react-native-firebase/auth';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
    navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const { signUp } = useAuth();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const handleRegister = async (): Promise<void> => {
        if (!name || !email || !password || !phone || !address) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            // 1. Crear usuario en Firebase
            await signUp(email, password);

            // 2. Obtener el token inmediatamente para asegurar que la API lo tenga
            const currentUser = auth().currentUser;
            if (currentUser) {
                const token = await currentUser.getIdToken();
                setAuthToken(token);

                // 3. Guardar datos adicionales en el backend
                await api.patch('/users/me', {
                    name,
                    phone,
                    address
                });
            }

            Alert.alert('¡Éxito!', 'Cuenta creada correctamente');
            // La navegación a Main es automática por el AuthNavigator

        } catch (error: any) {
            console.error(error);
            let errorMessage = 'Error al crear cuenta';

            if (error.response) {
                errorMessage = error.response.data.message || 'Error del servidor';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'El correo ya está registrado';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Correo inválido';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña es muy débil';
            }

            Alert.alert('Error', errorMessage);

            // Si falló el guardado en backend pero se creó en Firebase, 
            // el usuario quedará logueado pero sin datos. 
            // Podríamos hacer signOut() aquí si queremos ser estrictos, 
            // o dejar que complete su perfil luego.
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.subtitle}>Únete a Villa Chicken</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>👤</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre Completo"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>📧</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo Electrónico"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>📱</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Teléfono (Celular)"
                            placeholderTextColor="#999"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>📍</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dirección de Entrega"
                            placeholderTextColor="#999"
                            value={address}
                            onChangeText={setAddress}
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>🔒</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#D32F2F" style={styles.loader} />
                    ) : (
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={handleRegister}
                            activeOpacity={0.8}>
                            <Text style={styles.registerButtonText}>REGISTRARSE</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        marginTop: 40,
        marginBottom: 30,
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 16,
        color: '#D32F2F',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    inputIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    registerButton: {
        backgroundColor: '#D32F2F',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loader: {
        marginTop: 20,
    },
});

export default RegisterScreen;
