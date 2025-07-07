import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './services/post.service';
import { UserModule } from 'src/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MetaOption } from 'src/posts/entities/meta-option.entity';
import { TagModule } from 'src/tags/tag.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    UserModule,
    TagModule,
    AuthModule,
    TypeOrmModule.forFeature([Post, MetaOption]),
  ],
})
export class PostModule {}
