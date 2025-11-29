// Users service
// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // Este es el método que usaremos en el OrdersService
  async findOrCreate(firebaseUser: { uid: string; email: string; name?: string }): Promise<User> {
    let user = await this.userRepository.findOne({ where: { firebaseUid: firebaseUser.uid } });

    if (!user) {
      // Si el usuario no existe en nuestra BD, lo creamos
      user = this.userRepository.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name || firebaseUser.email.split('@')[0], // Un nombre por defecto
      });
      await this.userRepository.save(user);
    }

    return user;
  }


  /**
   * Actualiza los datos de un usuario específico.
   * @param id - El ID del usuario en nuestra base de datos.
   * @param updateUserDto - Los datos a actualizar.
   * @returns El usuario actualizado.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // El método `update` de TypeORM actualiza el registro en la base de datos.
    await this.userRepository.update(id, updateUserDto);

    // Es una buena práctica devolver el usuario actualizado para confirmar los cambios.
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
  
  /**
   * Busca un usuario por su UID de Firebase.
   * @param uid - El UID de Firebase.
   * @returns El usuario o null si no se encuentra.
   */
  async findByUid(uid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { firebaseUid: uid } });
  }


}