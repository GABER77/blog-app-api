import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  // Injecting Posts Service
  constructor(private readonly postsService: PostsService) {}

  @Get('{/:id}')
  public getPosts(@Param('id') userId: string) {
    return this.postsService.getAllPosts(userId);
  }
}
