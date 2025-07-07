import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/users/user.module';
import { PostModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TagModule } from './tags/tag.module';
import { typeOrmConfig } from './config/typeorm.config';
import { envValidationSchema } from './config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { ProtectGuard } from './auth/guards/protect.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Load environment variables globally
      envFilePath: `.env.${process.env.NODE_ENV}`, // Load environment file that matching NODE_ENV
      validationSchema: envValidationSchema, // Validate the environment variables at startup
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Let TypeOrmModule use environment variables
      inject: [ConfigService], // Inject ConfigService to read .env values
      useFactory: typeOrmConfig,
    }),
    UserModule,
    PostModule,
    AuthModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Apply ProtectGuard globally across the entire application
      provide: APP_GUARD,
      useClass: ProtectGuard,
    },
  ],
})
export class AppModule {}
