import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

export class CreatePostMetaOptonsDto {
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true, // Allows any key-value pairs, to make this work 👉 Record<string, any>
    example: {
      allowComments: false,
      theme: 'dark',
    },
  })
  @IsObject()
  @IsOptional()
  data: Record<string, any>;
}
