import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsPositive,
  Max,
  IsObject,
  ValidateNested,
  Allow,
} from 'class-validator';

// class FilterMap {
//   // accepts any additional fields for filtering (e.g. status, age)
//   [key: string]: any;
// }

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

  // accepts any additional fields for filtering (e.g. status, age)
  // @IsOptional()
  // @IsObject()
  // @ValidateNested()
  // filters?: FilterMap;

  @IsOptional()
  @IsObject()
  @Type(() => Object)
  filters?: Record<string, string>;
}
