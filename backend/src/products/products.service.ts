// Products service
// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Encuentra todos los productos que están marcados como disponibles.
   * @returns Una lista de productos disponibles.
   */
  findAllAvailable(): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        isAvailable: true, // <-- Clave: solo devuelve los productos disponibles
      },
    });
  }

  /**
   * Encuentra un producto por su ID.
   * @param id - El ID del producto.
   * @returns El producto encontrado.
   * @throws NotFoundException si el producto no existe.
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    return product;
  }

  // Aquí irán otros métodos como create(), findOne(), update(), etc. en el futuro
}