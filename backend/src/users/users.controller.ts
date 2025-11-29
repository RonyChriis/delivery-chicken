// src/users/users.controller.ts
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  async getProfile(@CurrentUser() firebaseUser: any) {
    // El usuario puede venir de Firebase (tiene .uid) o de la BD (tiene .firebaseUid)
    const uid = firebaseUser.uid || firebaseUser.firebaseUid;

    // Usamos el método findOrCreate para obtener el usuario de nuestra BD
    return this.usersService.findOrCreate({
      uid: uid,
      email: firebaseUser.email,
      name: firebaseUser.name,
    });
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() firebaseUser: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const uid = firebaseUser.uid || firebaseUser.firebaseUid;

    // Primero, obtenemos el usuario completo para tener su ID
    const user = await this.usersService.findOrCreate({
      uid: uid,
      email: firebaseUser.email,
      name: firebaseUser.name,
    });

    // Luego, llamamos al servicio para actualizarlo
    return this.usersService.update(user.id, updateUserDto);
  }
}