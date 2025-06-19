import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    // Injecting User Service using Circular Dependency
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public login(email: string, password: string, id: string) {
    const user = this.usersService.getUser('123');
    return 'tokennnnnnnnn';
  }

  public isAuth() {
    return true;
  }
}
