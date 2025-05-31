import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable WebSocket support with Socket.IO
  app.useWebSocketAdapter(new IoAdapter(app));

  // Enable CORS for all origins (adjust for production)
  app.enableCors({
    origin: true, // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3300);
  console.log('🚀 Application is running on: http://localhost:3300');
  console.log('🔌 Socket.IO server is running on: ws://localhost:3300');
}
bootstrap();
