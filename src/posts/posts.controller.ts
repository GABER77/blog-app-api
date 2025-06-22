import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

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

  @ApiOperation({
    summary: 'Create new post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get 201 response if your post created successfully',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @ApiOperation({
    summary: 'Uptates an existing post',
  })
  @ApiResponse({
    status: 200,
    description: 'You get 200 response if your post updated successfully',
  })
  @Patch()
  public updatePost(@Body() updatePostDto: UpdatePostDto) {
    console.log(updatePostDto);
  }
}
