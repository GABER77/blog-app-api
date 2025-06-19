import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { postTypeEnum } from '../enums/postType.enum';
import { postStatueEnum } from '../enums/postStatus.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(postTypeEnum)
  @IsNotEmpty()
  postType: postTypeEnum;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and the hyphen (-) symbol',
  })
  @IsNotEmpty()
  slug: string;

  @IsEnum(postStatueEnum)
  @IsNotEmpty()
  status: postStatueEnum;

  @IsString()
  @IsOptional()
  content?: string;

  @IsJSON()
  @IsOptional()
  schema?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsISO8601()
  publishedAt: Date;

  @IsString({ each: true })
  @MinLength(5, { each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  metaOptions: [{ Key: 'closeFriendsOnly'; value: 'true' }];
}
