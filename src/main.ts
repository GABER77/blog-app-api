import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe with strict rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties not defined in your DTO
      stopAtFirstError: true, // stops showing multiple errors per property
      transform: true, // transforms incoming request to match the DTO type
      transformOptions: {
        enableImplicitConversion: true, // Enable automatic type conversion for incoming request
      },
    }),
  );

  // Global Exception Filter
  // Handle DB related errors (e.g. failed .findOne, .save, .create, etc.)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Blog App API')
    .setDescription(
      'RESTful API for managing users, authentication, posts, and comments in a modular blog application.',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
