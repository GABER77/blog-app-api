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
import { UsersService } from './services/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,
  ) {}

  @Get('{/:id}')
  @ApiOperation({
    summary: 'Get all users or a specific user when ID is given.',
  })
  @ApiResponse({ status: 200 })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The maximum number of results to return per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'The page number you want the results to be returned from',
    example: 2,
  })
  public getUsers(
    @Param() getUserParamDto: GetUserParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.getAllUsers(getUserParamDto, limit, page);
  }

  @Post()
  public CreateUsers(@Body() createUserDto: CreateUserDto) {
    const { password, passwordConfirm } = createUserDto;

    // Ensure that password and passwordConfirm match
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match.');
    }

    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  public patchUsers(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
