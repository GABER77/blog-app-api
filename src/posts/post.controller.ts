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
} from '@nestjs/common';
import { PostService } from './services/post.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import {
  SwaggerCreatePost,
  SwaggerDeletePost,
  SwaggerGetAllPosts,
  SwaggerGetPostByMetaOptionId,
  SwaggerUpdatePost,
} from 'src/common/swagger/posts.swagger';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @SwaggerGetAllPosts()
  public getAllPosts(@Query() query: Record<string, string>) {
    return this.postService.getAllPosts(query);
  }

  @Post()
  @SwaggerCreatePost()
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser('id', ParseUUIDPipe) userId: string,
  ) {
    return this.postService.createPost(createPostDto, userId);
  }

  @Patch(':id')
  @SwaggerUpdatePost()
  public updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.updatePost(id, dto);
  }

  @Delete(':id')
  @SwaggerDeletePost()
  public async deletePost(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postService.deletePost(id);
    return {
      message:
        'Post and its related properties have been deleted successfully.',
    };
  }

  // Get Post from MetaOption ID (based on bidirectional relation)
  @Get(':metaOptionId/post')
  @SwaggerGetPostByMetaOptionId()
  public getPostByMetaOptionId(
    @Param('metaOptionId', ParseUUIDPipe) metaOptionId: string,
  ) {
    return this.postService.getPostByMetaOptionId(metaOptionId);
  }
}
