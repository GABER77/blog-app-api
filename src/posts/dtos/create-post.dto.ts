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
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { postTypeEnum } from '../enums/postType.enum';
import { postStatusEnum } from '../enums/postStatus.enum';
import { CreatePostMetaOptonsDto } from './create-post-meta-options.dto';

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
    enum: postStatusEnum,
  })
  @IsEnum(postStatusEnum)
  @IsNotEmpty()
  status: postStatusEnum;

  @ApiProperty({
    example: 'my-example-url',
    description:
      'Slug can only contain lowercase letters, numbers, and hyphens (-)',
  })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and hyphens (-)',
  })
  @IsNotEmpty()
  slug: string;

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
    type: CreatePostMetaOptonsDto,
    description: 'Meta options as a key-value object',
    example: {
      data: {
        sidebarEnabled: true,
        allowComments: false,
      },
    },
  })
  @IsOptional()
  @ValidateNested()
  // Convert each item to class instance so nested validation works
  @Type(() => CreatePostMetaOptonsDto)
  metaOptions?: CreatePostMetaOptonsDto;

  @IsString()
  authorId: string;
}
