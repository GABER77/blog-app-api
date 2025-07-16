import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    minLength: 3,
    maxLength: 40,
    description: 'User’s full name (optional)',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Valid email address (optional)',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsOptional()
  email?: string;
}
