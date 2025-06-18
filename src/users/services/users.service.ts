import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public getAllUsers(
    getUserParamDto: GetUserParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

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
