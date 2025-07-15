import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add all middleware
  appCreate(app);

  // Start the application
  const port = process.env.PORT ?? 8000;
  await app.listen(port).then(() => {
    console.log(`🚀 App running on port ${port}`);
  });
}

void bootstrap();
