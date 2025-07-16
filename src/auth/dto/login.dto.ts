import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User email address used for login',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd123!',
    description: 'Password associated with the user account',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
