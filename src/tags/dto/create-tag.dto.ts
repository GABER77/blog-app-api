import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    type: [String],
    example: ['nestjs', 'typescript'],
    description:
      'An array of tag strings. Each tag must be a non-empty string.',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  tags: string[];
}
