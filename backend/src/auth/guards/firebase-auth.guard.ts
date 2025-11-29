import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { firebaseAdmin } from '../../config/firebase.config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private usersService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided or invalid format.');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // 1. Verificar el token de Firebase
      const firebaseUser = await firebaseAdmin.auth().verifyIdToken(token);

      // 2. Buscar al usuario completo en nuestra base de datos usando el uid
      const user = await this.usersService.findByUid(firebaseUser.uid);

      if (user) {
        // Si existe, adjuntamos el usuario de la BD
        request.user = user;
      } else {
        // Si no existe (es un usuario nuevo), adjuntamos el usuario de Firebase
        // Esto permite que el controlador use findOrCreate para crearlo
        request.user = firebaseUser;
      }

      return true;
    } catch (error) {
      console.error('Error in FirebaseAuthGuard:', error);
      throw new UnauthorizedException('Invalid token.');
    }
  }
}