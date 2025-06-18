import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserParamDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) // Because the entire URL is string by default
  id?: number;
}
