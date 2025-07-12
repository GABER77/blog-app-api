import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsOptional()
  email?: string;
}
