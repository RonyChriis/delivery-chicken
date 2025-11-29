// src/admin/admin.controller.ts
import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { UpdateStatusDto } from '../orders/dto/update.status.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('admin')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly ordersService: OrdersService) { }

  @Patch('orders/:id/status')
  @Roles(UserRole.ADMIN)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.ordersService.updateStatus(parseInt(id), updateStatusDto);
  }

  @Get('orders')
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.ordersService.findAll();
  }
}