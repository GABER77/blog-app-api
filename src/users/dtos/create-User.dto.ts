import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  @MaxLength(40, { message: 'Name must not exceed 40 characters.' })
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'Password must include at least one letter, one number, and one special character.',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Password confirmation is required.' })
  passwordConfirm: string;
}
