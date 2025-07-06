import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  BadRequestException,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UserService } from './services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import {
  SwaggerCreateUser,
  SwaggerGetAllUsers,
  SwaggerGetUser,
  SwaggerPatchUser,
} from 'src/common/swagger/users.swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SwaggerGetAllUsers()
  public getAllUsers(@Query() query: Record<string, string>) {
    return this.userService.getAllUsers(query);
  }

  @Get(':id')
  @SwaggerGetUser()
  async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Post()
  @SwaggerCreateUser()
  public CreateUser(@Body() createUserDto: CreateUserDto) {
    const { password, passwordConfirm } = createUserDto;

    // Ensure that password and passwordConfirm match
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match.');
    }

    return this.userService.createUser(createUserDto);
  }

  // @Patch()
  // @SwaggerPatchUser()
  // public patchUsers(@Body() patchUserDto: PatchUserDto) {
  //   return patchUserDto;
  // }
}
