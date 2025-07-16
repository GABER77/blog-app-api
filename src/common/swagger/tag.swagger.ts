import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Tag } from '../../tags/tag.entity';
import { CreateTagDto } from '../../tags/dto/create-tag.dto';

export const SwaggerFindAllTags = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all tags' }),
    ApiResponse({
      status: 200,
      description: 'List of tags returned successfully',
      type: [Tag],
    }),
  );

export const SwaggerCreateTags = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create new tags',
      description:
        'Creates only new tags. Tags that already exist will be ignored.',
    }),
    ApiBody({ type: CreateTagDto }),
    ApiResponse({
      status: 201,
      description: 'Tags created successfully',
      type: [Tag],
    }),
  );

export const SwaggerDeleteTag = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a tag by ID' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'UUID of the tag to delete',
      example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    }),
    ApiResponse({
      status: 200,
      description: 'Tag deleted successfully',
      schema: {
        example: {
          message: "Tag 'example-tag' has been deleted successfully.",
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Tag with the given ID not found',
    }),
  );
