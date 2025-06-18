import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  public getAllPosts(userId: string) {
    return [
      {
        title: 'testPost',
        content: 'testContent',
      },
      {
        title: 'testPost2',
        content: 'testContent2',
      },
    ];
  }
}
