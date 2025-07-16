import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Post } from '../../posts/entities/post.entity';

export function SwaggerGetAllPosts() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all posts' }),
    ApiResponse({
      status: 200,
      description: 'List of all posts',
      type: [Post],
    }),
  );
}

export function SwaggerCreatePost() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new post' }),
    ApiResponse({
      status: 201,
      description: 'The post has been successfully created',
      type: Post,
    }),
  );
}

export function SwaggerUpdatePost() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a post by ID' }),
    ApiResponse({
      status: 200,
      description: 'Post updated successfully',
      type: Post,
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found',
    }),
  );
}

export function SwaggerDeletePost() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a post by ID' }),
    ApiResponse({
      status: 200,
      description: 'Post deleted successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found',
    }),
  );
}

export function SwaggerGetPostByMetaOptionId() {
  return applyDecorators(
    ApiOperation({ summary: 'Get post by MetaOption ID' }),
    ApiResponse({
      status: 200,
      description: 'Post retrieved from MetaOption relation',
      type: Post,
    }),
    ApiResponse({
      status: 404,
      description: 'Post not found for this MetaOption',
    }),
  );
}
