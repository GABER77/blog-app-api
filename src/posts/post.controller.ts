import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './services/post.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  public getAllPosts(@Query() query: Record<string, string>) {
    return this.postService.getAllPosts(query);
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
    return this.postService.createPost(createPostDto);
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
    return this.postService.updatePost(id, dto);
  }

  @Delete(':id')
  public async deletePost(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postService.deletePost(id);
    return {
      message:
        'Post and its related properties have been deleted successfully.',
    };
  }

  // Get Post from MetaOption ID (based on bidirectional relation)
  @Get(':metaOptionId/post')
  public getPostByMetaOptionId(
    @Param('metaOptionId', ParseUUIDPipe) metaOptionId: string,
  ) {
    return this.postService.getPostByMetaOptionId(metaOptionId);
  }
}
