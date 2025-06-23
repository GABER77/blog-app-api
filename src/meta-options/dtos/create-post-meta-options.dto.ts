import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptonsDto {
  @IsNotEmpty()
  @IsJSON()
  metaValue: JSON;
}
