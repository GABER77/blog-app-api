import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { typeOrmConfig } from './config/typeorm.config';

// Ensure the application does not start without a valid NODE_ENV
const allowedEnvs = ['development', 'production', 'test'];
const nodeEnv = process.env.NODE_ENV;
if (!nodeEnv || !allowedEnvs.includes(nodeEnv)) {
  throw new Error('❌ NODE_ENV is not set to a valid enviroment.');
}
console.log(nodeEnv);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Load environment variables globally
      envFilePath: `.env.${nodeEnv}`, // Load environment file that matching NODE_ENV
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Let TypeOrmModule use environment variables
      inject: [ConfigService], // Inject ConfigService to read .env values
      useFactory: typeOrmConfig,
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
