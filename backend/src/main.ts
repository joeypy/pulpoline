import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8000',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (como aplicaciones móviles o herramientas como Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Verificar si el origen está en la lista de permitidos
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error(`Not allowed by CORS: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
    }, // Cambia esto al puerto de tu frontend local
    credentials: true, // Permite el envío de cookies
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no incluidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si llegan campos extra
      transform: true, // Transforma payloads al tipo declarado en el DTO
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos básicos automáticamente
      },
    }),
  );

  const port = process.env.PORT || 8000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
