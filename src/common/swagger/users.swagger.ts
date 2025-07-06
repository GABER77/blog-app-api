import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { User } from '../../users/user.entity';

export const SwaggerGetAllUsers = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Get all users with support for pagination, filtering, sorting, searching, and field limiting.',
      description:
        'You can filter by any field directly using query parameters (e.g. role=admin or age[gte]=18).',
    }),

    ApiResponse({
      status: 200,
      description: 'List of users returned successfully.',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      example: 1,
      description: 'Page number.',
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      example: 10,
      description: 'Number of results per page (max 20).',
    }),
    ApiQuery({
      name: 'sort',
      type: String,
      required: false,
      example: '-createdAt,name',
      description: 'Sort by fields. Use "-" for descending.',
    }),
    ApiQuery({
      name: 'fields',
      type: String,
      required: false,
      example: 'name,email',
      description: 'Fields to include in each result.',
    }),
    ApiQuery({
      name: 'search',
      type: String,
      required: false,
      example: 'john',
      description:
        'Search text, applies only to searchable fields (name and email).',
    }),
  );

export const SwaggerGetUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a specific user by ID.' }),
    ApiResponse({ status: 200, type: User }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'UUID of the user.',
      example: '049076d2-fc27-48bb-9d07-6f21fa4f6345',
    }),
  );

export const SwaggerUpdateUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update user fields (excluding password)' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'UUID of the user to update',
      example: '049076d2-fc27-48bb-9d07-6f21fa4f6345',
    }),
    ApiBody({ type: UpdateUserDto }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
      type: User,
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
