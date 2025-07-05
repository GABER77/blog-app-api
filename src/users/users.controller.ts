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
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './services/users.service';
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
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @SwaggerGetAllUsers()
  public getAllUsers(@Query() query: Record<string, string>) {
    return this.usersService.getAllUsers(query);
  }

  @Get(':id')
  @SwaggerGetUser()
  async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return await this.usersService.getUser(id);
  }

  @Post()
  @SwaggerCreateUser()
  public CreateUsers(@Body() createUserDto: CreateUserDto) {
    const { password, passwordConfirm } = createUserDto;

    // Ensure that password and passwordConfirm match
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match.');
    }

    return this.usersService.createUser(createUserDto);
  }

  // @Patch()
  // @SwaggerPatchUser()
  // public patchUsers(@Body() patchUserDto: PatchUserDto) {
  //   return patchUserDto;
  // }
}
