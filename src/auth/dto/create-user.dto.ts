import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    minLength: 3,
    maxLength: 40,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Valid email address of the user',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description:
      'Password with at least 8 characters, including letters, numbers, and special characters',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'Password must include at least one letter, one number, and one special character.',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description: 'Must match the password field',
  })
  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiPropertyOptional({
    example: 'https://s3.amazonaws.com/myapp/users/123/profile.jpg',
    description: 'Optional URL to the user’s profile image',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
