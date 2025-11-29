// Products controller
// src/products/products.controller.ts
import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'; // <-- Importa 'Get'
import { ProductsService } from './products.service';
// ... otras importaciones que necesites más adelante (CreateProductDto, etc.)

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get() // <-- Decorador para manejar peticiones GET a /products
  findAll() {
    // Llama al servicio para obtener todos los productos disponibles
    return this.productsService.findAllAvailable();
  }
  // <-- Añade este nuevo método
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(parseInt(id));
  }

  // Aquí irán otros métodos como @Post(), @Get(':id'), etc. en el futuro
}