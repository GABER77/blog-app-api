import { Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-users-param.dto';

@Injectable()
export class UsersService {
  public findAll(
    getUserParamDto: GetUserParamDto,
    limit: number,
    page: number,
  ) {
    return [
      {
        name: 'test1',
        email: 'test1@test.com',
      },
      {
        name: 'test2',
        email: 'test2@test.com',
      },
    ];
  }

  public findOne(id: number) {
    return {
      id: 123,
      name: 'test1',
      email: 'test1@test.com',
    };
  }
}
