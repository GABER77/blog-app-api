import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './services/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MetaOption } from 'src/posts/entities/meta-option.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Post, MetaOption])],
})
export class PostsModule {}
