// Orders module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Product]),
        UsersModule, // <-- Para que OrdersService pueda usar UsersService
    ],
    controllers: [OrdersController],
    providers: [OrdersService,

    ],  // <-- El servicio se crea aquí
    exports:[OrdersService,
        
    ], // <-- 👇 AQUÍ ESTÁ LA CLAVE: Exportamos 
                                // el servicio para que otros módulos puedan inyectarlo
})
export class OrdersModule { }