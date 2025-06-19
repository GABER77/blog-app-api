import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserParamDto {
  @ApiPropertyOptional({
    description: 'Get user by ID',
    example: '9352895861',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number) // Because the entire URL is string by default
  id?: number;
}
