import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🔥 CONFIGURACIÓN CORS - CRÍTICA
  app.enableCors({
    origin: [
      'http://localhost:19006',      // Metro Bundler
      'http://192.0.0.1:19006',  // Tu IP con Metro
      'http://192.0.0.1:3000',   // Tu backend
      'http://localhost:3000',       // Localhost
      'http://localhost:8081',       // React Native default
      /\.yourdomain\.com$/,          // Dominio producción
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  
  // 🔥 ESCUCHAR EN TODAS LAS INTERFACES - CRÍTICO
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
  console.log(`🌐 Network access: http://192.0.0.1:${port}`);
}
bootstrap();
