/**
 * Auth Screen (Diseño basado en mockup con imágenes reales)
 * Pantalla de autenticación con diseño moderno
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
    Image,
    Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

interface Props {
    navigation: AuthScreenNavigationProp;
}

const AuthScreen: React.FC<Props> = ({ navigation }) => {
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (): Promise<void> => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa correo y contraseña');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            // La navegación es automática gracias al AuthContext
        } catch (error: any) {
            let errorMessage = 'Error al iniciar sesión';
            if (error.code === 'auth/invalid-email') errorMessage = 'Correo inválido';
            if (error.code === 'auth/user-disabled') errorMessage = 'Usuario deshabilitado';
            if (error.code === 'auth/user-not-found') errorMessage = 'Usuario no encontrado';
            if (error.code === 'auth/wrong-password') errorMessage = 'Contraseña incorrecta';
            if (error.code === 'auth/invalid-credential') errorMessage = 'Credenciales inválidas';

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>

                {/* Header con logo */}
                <View style={styles.header}>
                    <Text style={styles.logo}>VILLA{'\n'}CHICKEN</Text>

                    {/* Imagen de la mascota asomándose */}
                    <View style={styles.mascotContainer}>
                        <Image
                            source={require('../assets/images/login-mascot.png')}
                            style={styles.mascotImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Formulario */}
                <View style={styles.formContainer}>
                    <View style={styles.card}>
                        {/* Input de Correo */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>📧</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Correo"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        {/* Input de Contraseña */}
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

                        {/* Botón de Ingresar */}
                        {loading ? (
                            <ActivityIndicator size="large" color="#D32F2F" style={styles.loader} />
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.loginButton}
                                    onPress={handleLogin}
                                    activeOpacity={0.8}>
                                    <Text style={styles.loginButtonText}>INGRESAR</Text>
                                </TouchableOpacity>

                                {/* Separador */}
                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>o</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Botones sociales */}
                                <View style={styles.socialButtons}>
                                    <TouchableOpacity
                                        style={styles.socialButton}
                                        onPress={() => Alert.alert('Google', 'Login con Google próximamente')}>
                                        <Text style={styles.socialIconGoogle}>G</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.socialButton}
                                        onPress={() => Alert.alert('Facebook', 'Login con Facebook próximamente')}>
                                        <Text style={styles.socialIconFacebook}>f</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Link de registro */}
                                <TouchableOpacity onPress={handleRegister}>
                                    <Text style={styles.registerLink}>
                                        ¿No tienes cuenta? <Text style={styles.registerLinkBold}>Regístrate</Text>
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D32F2F', // Rojo característico
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        position: 'relative',
    },
    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    mascotContainer: {
        width: width * 0.5,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -30, // Para que se superponga con el card blanco
        zIndex: 10,
    },
    mascotImage: {
        width: '100%',
        height: '100%',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 50,
        paddingHorizontal: 30,
        paddingBottom: 30,
    },
    card: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E8E8E8',
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
    loginButton: {
        backgroundColor: '#D32F2F',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loader: {
        marginTop: 20,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#999',
        fontSize: 14,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    socialIconGoogle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#DB4437',
    },
    socialIconFacebook: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4267B2',
    },
    registerLink: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
    registerLinkBold: {
        color: '#D32F2F',
        fontWeight: 'bold',
    },
});

export default AuthScreen;
