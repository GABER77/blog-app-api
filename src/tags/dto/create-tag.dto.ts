import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateTagDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  tags: string[];
}
