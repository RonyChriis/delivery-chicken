// src/orders/orders.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update.status.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private dataSource: DataSource,
    ) { }

    /**
     * Genera un número de orden único.
     * Formato: ORD-YYYYMMDD-XXXX
     * Ejemplo: ORD-20251126-3847
     */
    private generateOrderNumber(): string {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
        return `ORD-${date}-${randomSuffix}`;
    }

    async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let totalAmount = 0;
            const orderItems: OrderItem[] = [];

            for (const item of createOrderDto.items) {
                const product = await this.productRepository.findOne({
                    where: { id: item.productId },
                });

                // Validar que el producto existe
                if (!product) {
                    throw new NotFoundException(`Product with ID ${item.productId} not found`);
                }

                // Validar que el producto está disponible
                if (!product.isAvailable) {
                    throw new BadRequestException(`Product "${product.name}" is not available`);
                }

                const itemTotal = Number(product.price) * item.quantity;
                totalAmount += itemTotal;

                const orderItem = this.orderItemRepository.create({
                    quantity: item.quantity,
                    priceAtTime: product.price,
                    product: product,
                });
                orderItems.push(orderItem);
            }

            // Generar número de orden único
            const orderNumber = this.generateOrderNumber();

            const order = this.orderRepository.create({
                orderNumber: orderNumber,
                status: OrderStatus.PENDING,
                paymentMethod: createOrderDto.paymentMethod,
                orderType: createOrderDto.orderType,
                totalAmount: totalAmount,
                deliveryAddress: createOrderDto.deliveryAddress,
                user: user,
                items: orderItems,
            });

            const savedOrder = await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();

            const orderWithRelations = await this.orderRepository.findOne({
                where: { id: savedOrder.id },
                relations: ['items', 'items.product', 'user'],
            });

            if (!orderWithRelations) {
                throw new NotFoundException('Order not found after creation');
            }

            return orderWithRelations;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllByUser(userId: number): Promise<Order[]> {
        return this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number, userId: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: id, user: { id: userId } },
            relations: ['items', 'items.product', 'user'],
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found.`);
        }

        return order;
    }

    // Define las transiciones de estado permitidas
    private readonly allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
        [OrderStatus.PAID]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
        [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_PICKUP],
        [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.DELIVERED],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
    };

    /**
     * Actualiza el estado de un pedido.
     * @param id - El ID del pedido.
     * @param updateStatusDto - El nuevo estado.
     * @returns El pedido actualizado.
     */
    async updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id } });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found.`);
        }

        const { status: newStatus } = updateStatusDto;
        const currentStatus = order.status;

        // Validar que la transición de estado sea permitida
        const allowedNextStatuses = this.allowedTransitions[currentStatus];
        if (!allowedNextStatuses.includes(newStatus)) {
            throw new BadRequestException(
                `Cannot transition from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowedNextStatuses.join(', ')}.`,
            );
        }

        order.status = newStatus;
        return this.orderRepository.save(order);
    }

    /**
     * Cancela un pedido del usuario.
     * @param id - El ID del pedido a cancelar.
     * @param userId - El ID del usuario autenticado.
     * @returns El pedido cancelado.
     * @throws NotFoundException si el pedido no existe o no pertenece al usuario.
     * @throws BadRequestException si el pedido no está en estado PENDING.
     */
    async remove(id: number, userId: number): Promise<Order> {
        // Buscar el pedido y validar que pertenezca al usuario
        const order = await this.orderRepository.findOne({
            where: { id: id, user: { id: userId } },
            relations: ['items', 'items.product', 'user'],
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found.`);
        }

        // Validar que el pedido esté en estado PENDING
        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException(
                `Cannot cancel order with status ${order.status}. Only PENDING orders can be cancelled.`,
            );
        }

        // Actualizar el estado a CANCELLED
        order.status = OrderStatus.CANCELLED;
        return this.orderRepository.save(order);
    }

    /**
     * Obtiene todos los pedidos del sistema (solo para administradores).
     * @returns Lista de todos los pedidos con sus relaciones.
     */
    async findAll(): Promise<Order[]> {
        return this.orderRepository.find({
            relations: ['items', 'items.product', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
}