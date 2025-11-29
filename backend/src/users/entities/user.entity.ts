// User entity with firebaseUid field
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

// 1. Define el enum para los roles
export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    firebaseUid: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

     // 2. Añade la columna de rol
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // Por defecto, todo nuevo usuario es 'USER'
  })
  role: UserRole;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}