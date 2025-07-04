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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,
  ) {}

  @Get()
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
  public getAllUsers(@Query() queryDto: QueryDto) {
    return this.usersService.getAllUsers(queryDto);
  }

  @Get(':id')
  async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return await this.usersService.getUser(id);
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
