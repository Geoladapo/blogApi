import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Use validation pip globally
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /**
   * swagger configuration
   */

  const config = new DocumentBuilder()
    .setTitle('NestJS Masterclass - Blog app Api')
    .setDescription('USee the base API URL at http://localhost:3000/')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense('MIT License', '')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  // Instantiate Document

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
