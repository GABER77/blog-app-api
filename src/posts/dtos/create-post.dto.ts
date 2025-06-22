import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postTypeEnum } from '../enums/postType.enum';
import { postStatusEnum } from '../enums/postStatus.enum';
import { CreatePostMetaOptonsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is the post title',
  })
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postTypeEnum,
  })
  @IsEnum(postTypeEnum)
  @IsNotEmpty()
  postType: postTypeEnum;

  @ApiProperty({
    example: 'my-example-url',
  })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and the hyphen (-) symbol',
  })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    enum: postStatusEnum,
  })
  @IsEnum(postStatusEnum)
  @IsNotEmpty()
  status: postStatusEnum;

  @ApiPropertyOptional({
    example: 'This is the post ontent',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Image path for your post',
    example: 'http://localhost.com/images/image1.jpg',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Array of tags pass as string value',
    example: ['nest', 'typescript'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description:
            'The key can be any string identifier for your meta option',
          example: 'sidebarEnabled',
        },
        value: {
          type: 'any',
          description: 'Any value that you want to save to the key',
          example: true,
        },
      },
    },
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  // Convert each item to class instance so nested validation works
  @Type(() => CreatePostMetaOptonsDto)
  metaOptions?: CreatePostMetaOptonsDto[];
}
