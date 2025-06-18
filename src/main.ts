import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe with strict rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties not defined in your DTO
      forbidNonWhitelisted: true, // throws error if extra fields are present
      stopAtFirstError: true, // stops showing multiple errors per property
      transform: true, // transforms incoming request to match the DTO type
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
