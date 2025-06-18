import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';

@Controller('users')
export class UsersController {
  @Get('{/:id}')
  public getUsers(
    @Param() getUserParamDto: GetUserParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(getUserParamDto);
    return 'Get Users Endpoint';
  }

  @Post()
  public CreateUsers(@Body() createUserDto: CreateUserDto) {
    const { password, passwordConfirm } = createUserDto;

    // Ensure that password and passwordConfirm match
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match.');
    }

    console.log(typeof createUserDto);
    console.log(createUserDto instanceof CreateUserDto);
    return 'Post Users Endpoint';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
