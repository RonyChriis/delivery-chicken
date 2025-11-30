/**
 * API Configuration
 * Define la URL base de la API del backend
 */

// ⚠️ IMPORTANTE PARA BLUESTACKS:
// "localhost" NO FUNCIONA en BlueStacks porque es un emulador separado.
// 
// PASOS:
// 1. Ejecuta "ipconfig" en PowerShell
// 2. Busca tu "IPv4 Address" (ej: 192.168.1.5)
// 3. Prueba en navegador: http://TU_IP:3000/products
// 4. Si funciona, reemplaza abajo con tu IP real
// 5. Recarga la app (presiona 'r' en Metro)

// Para Android Studio Emulator: usa 10.0.2.2
// Para BlueStacks o dispositivo físico: usa tu IP local

export const API_URL = 'http://192.0.0.1:3000';
