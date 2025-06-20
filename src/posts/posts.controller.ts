import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    // Injecting Posts Service
    private readonly postsService: PostsService,
  ) {}

  @Get('{/:id}')
  public getPosts(@Param('id') userId: string) {
    return this.postsService.getAllPosts(userId);
  }

  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}
