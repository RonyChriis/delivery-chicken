/**
 * Profile Screen
 * Pantalla de perfil de usuario con visualización y edición
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
    Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfileScreen: React.FC = () => {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Datos del usuario
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/me');
            const userData = response.data;

            setName(userData.name || '');
            setPhone(userData.phone || '');
            setAddress(userData.address || '');
            setEmail(userData.email || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Error', 'No se pudo cargar la información del perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        try {
            setSaving(true);
            await api.patch('/users/me', {
                name,
                phone,
                address,
            });
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (error) {
                            console.error('Error signing out:', error);
                        }
                    }
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#D32F2F" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </Text>
                </View>
                <Text style={styles.headerName}>{name || 'Usuario'}</Text>
                <Text style={styles.headerEmail}>{email}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    {!isEditing && (
                        <TouchableOpacity onPress={() => setIsEditing(true)}>
                            <Text style={styles.editButton}>Editar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.card}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre Completo</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Tu nombre"
                            />
                        ) : (
                            <Text style={styles.value}>{name || 'No especificado'}</Text>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Teléfono</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Tu teléfono"
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text style={styles.value}>{phone || 'No especificado'}</Text>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dirección</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Tu dirección"
                                multiline
                            />
                        ) : (
                            <Text style={styles.value}>{address || 'No especificada'}</Text>
                        )}
                    </View>
                </View>

                {isEditing && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => {
                                setIsEditing(false);
                                fetchProfile(); // Revert changes
                            }}
                            disabled={saving}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
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
    },
    header: {
        backgroundColor: '#D32F2F',
        paddingTop: 60,
        paddingBottom: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
    headerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    headerEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    content: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    editButton: {
        color: '#D32F2F',
        fontWeight: '600',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        color: '#999',
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#D32F2F',
        paddingVertical: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 15,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#999',
    },
    saveButton: {
        backgroundColor: '#D32F2F',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#FFF0F0',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    logoutText: {
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileScreen;
