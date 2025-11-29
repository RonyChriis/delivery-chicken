// Auth module
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [UsersModule], // AuthModule necesita UsersModule para encontrar o crear usuarios
  providers: [
    // Aquí irán los providers como FirebaseAuthGuard
    FirebaseAuthGuard,
    RolesGuard, // <-- Provee el RolesGuard
  ],
  exports: [
    // Aquí exportaremos el guard para que otros módulos puedan usarlo
    FirebaseAuthGuard,
    RolesGuard, // <-- Exporta el RolesGuard
  ],
})
export class AuthModule {}