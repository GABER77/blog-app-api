import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id{/:optional}')
  public getUsers(@Param() params: any, @Query() query: any) {
    console.log(params);
    console.log(query);
    return 'Get Users Endpoint';
  }

  @Post()
  public CreateUsers(@Body() body: any) {
    console.log(body);
    return 'Post Users Endpoint';
  }
}
