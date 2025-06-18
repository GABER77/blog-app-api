import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class PostsService {
  // Injecting Users Service
  constructor(private readonly usersService: UsersService) {}

  public getAllPosts(userId: string) {
    const user = this.usersService.getUser(userId);
    return [
      {
        user: user,
        title: 'testPost',
        content: 'testContent',
      },
      {
        user: user,
        title: 'testPost2',
        content: 'testContent2',
      },
    ];
  }
}
