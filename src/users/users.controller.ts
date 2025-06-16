import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('{/:id}')
  public getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(typeof id, id);
    console.log(typeof limit, limit);
    console.log(typeof page, page);
    return 'Get Users Endpoint';
  }

  @Post()
  public CreateUsers(@Body() body: any) {
    console.log(body);
    return 'Post Users Endpoint';
  }
}
