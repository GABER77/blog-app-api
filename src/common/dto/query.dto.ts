import { IsOptional, IsString, IsPositive, Max } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsPositive()
  @Max(20)
  limit?: number = 10;

  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  fields?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
