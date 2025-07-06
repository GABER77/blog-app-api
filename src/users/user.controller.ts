import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import {
  SwaggerGetAllUsers,
  SwaggerGetUser,
  SwaggerUpdateUser,
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

  @Patch(':id')
  @SwaggerUpdateUser()
  public updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
