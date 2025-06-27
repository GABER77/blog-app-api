import { IsArray, IsString } from 'class-validator';

export class CreateTagDto {
  @IsArray()
  @IsString({ each: true })
  names: string[];
}
