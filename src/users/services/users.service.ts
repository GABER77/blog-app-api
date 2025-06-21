import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/services/auth.service';

/** Class to connect to user table and perform business operations */
@Injectable()
export class UsersService {
  /**Constructor to inject dependencies */
  constructor(
    // Injecting AuthService using Circular Dependency
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /** Get all users from database */
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

  /** Get single user from database by ID */
  public getUser(id: string) {
    return {
      id: 123,
      name: 'test1',
      email: 'test1@test.com',
    };
  }
}
