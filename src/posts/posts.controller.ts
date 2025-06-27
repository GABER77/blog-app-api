import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
  @Patch(':id')
  public updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, dto);
  }

  @Delete(':id')
  public async deletePost(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postsService.deletePost(id);
    return {
      message:
        'Post and its related MetaOption have been deleted successfully.',
    };
  }

  // Get Post from MetaOption ID (based on bidirectional relation)
  @Get(':metaOptionId/post')
  public getPostByMetaOptionId(
    @Param('metaOptionId', ParseUUIDPipe) metaOptionId: string,
  ) {
    return this.postsService.getPostByMetaOptionId(metaOptionId);
  }
}
