// src/orders/dto/update-status.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateStatusDto {
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  @IsNotEmpty({ message: 'Status cannot be empty' })
  status: OrderStatus;
}