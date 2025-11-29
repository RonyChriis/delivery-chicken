// src/orders/dto/create-order-item.dto.ts
import { IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
    @IsNumber()
    productId: number;

    @IsNumber()
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;
}
