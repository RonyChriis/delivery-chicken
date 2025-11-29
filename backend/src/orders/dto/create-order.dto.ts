// src/orders/dto/create-order.dto.ts
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, OrderType } from '../entities/order.entity';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsEnum(PaymentMethod, { message: 'Payment method must be CASH or CARD' })
    paymentMethod: PaymentMethod;

    @IsEnum(OrderType, { message: 'Order type must be DELIVERY or IN_STORE' })
    orderType: OrderType;

    @IsString()
    @IsOptional()
    deliveryAddress?: string;
}
