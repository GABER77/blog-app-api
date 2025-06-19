import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostMetaOptonsDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
