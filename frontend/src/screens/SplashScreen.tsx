/**
 * Splash Screen
 * Pantalla de bienvenida con logo y mascota en moto
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
    onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Animación de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 40,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Navegar después de 2.5 segundos
        const timer = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            {/* Círculos decorativos de fondo */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: slideAnim },
                        ],
                    },
                ]}>
                {/* Logo */}
                <Text style={styles.logo}>VILLA{'\n'}CHICKEN</Text>

                {/* Subtítulo */}
                <Text style={styles.subtitle}></Text>

                {/* Imagen de la mascota en moto */}
                <Image
                    source={require('../assets/images/splash-mascot.png')}
                    style={styles.mascotImage}
                    resizeMode="contain"
                />

                <Text style={styles.tagline}>Delivery de Sabor 🏍️💨</Text>
            </Animated.View>

            {/* Indicador de carga */}
            <View style={styles.footer}>
                <View style={styles.loadingBar}>
                    <Animated.View
                        style={[
                            styles.loadingBarFill,
                            { opacity: fadeAnim },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D32F2F',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    circle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        top: -100,
        right: -100,
    },
    circle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        bottom: -50,
        left: -50,
    },
    circle3: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        top: height / 2,
        left: -75,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    logo: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 4,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
    },
    subtitle: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '600',
        marginBottom: 20,
        opacity: 0.95,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    mascotImage: {
        width: width * 0.7,
        height: height * 0.35,
        maxWidth: 320,
        maxHeight: 320,
        marginBottom: 10,
    },
    tagline: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
        opacity: 0.9,
        marginTop: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 40,
    },
    loadingBar: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    loadingBarFill: {
        width: '70%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
});

export default SplashScreen;


