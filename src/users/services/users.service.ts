import { Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-users-param.dto';

@Injectable()
export class UsersService {
  public getAllUsers(
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

  public getUser(id: string) {
    return {
      id: 123,
      name: 'test1',
      email: 'test1@test.com',
    };
  }
}
