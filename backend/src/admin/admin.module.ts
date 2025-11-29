// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from '../orders/orders.module';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';



@Module({
  imports: [
    // Importamos OrdersModule para poder usar el OrdersService
    OrdersModule,
    // Importamos AuthModule para poder usar los guards (FirebaseAuthGuard, RolesGuard)
    AuthModule,
    UsersModule,
    
  ],
  controllers: [
    // 👇 Aquí registramos el AdminController
    AdminController,
  ],
  providers: [
    // Los providers (como servicios) se importan desde otros módulos
   
  ],
})
export class AdminModule {}