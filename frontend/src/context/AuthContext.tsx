import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { setAuthToken } from '../services/api';

interface AuthContextData {
    user: FirebaseAuthTypes.User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState(true);

    // Escuchar cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (userState) => {
            setUser(userState);

            if (userState) {
                // Obtener el token y configurarlo en axios
                const token = await userState.getIdToken();
                setAuthToken(token);
            } else {
                setAuthToken(null);
            }

            if (loading) setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Actualizar el token periódicamente (Firebase tokens expiran en 1 hora)
    useEffect(() => {
        if (user) {
            const interval = setInterval(async () => {
                const token = await user.getIdToken(true); // true fuerza refresh
                setAuthToken(token);
            }, 50 * 60 * 1000); // 50 minutos

            return () => clearInterval(interval);
        }
    }, [user]);

    const signIn = async (email: string, password: string) => {
        await auth().signInWithEmailAndPassword(email, password);
    };

    const signUp = async (email: string, password: string) => {
        await auth().createUserWithEmailAndPassword(email, password);
    };

    const signOut = async () => {
        await auth().signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
