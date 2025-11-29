// Firebase configuration
// src/config/firebase.config.ts
import * as admin from 'firebase-admin';

import * as path from 'path';

// Construimos la ruta absoluta al archivo JSON
// Asumiendo que el archivo está en la raíz del proyecto (backend/)
// y este archivo está en src/config/ (o dist/config/ al compilar)
const serviceAccountPath = path.resolve(__dirname, '../../chickenfront-firebase-adminsdk-fbsvc-616782a629.json');

try {
  // Evita inicializar Firebase más de una vez
  if (!admin.apps.length) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  console.error('Attempted path:', serviceAccountPath);
}

// Exportamos la instancia de admin para usarla en otros lugares (como el Guard)
export const firebaseAdmin = admin;