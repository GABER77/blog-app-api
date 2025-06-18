import { Controller } from '@nestjs/common';
import { PostsService } from './services/posts.service';

@Controller('posts')
export class PostsController {
  // Injecting Posts Service
  constructor(private readonly postsService: PostsService) {}
}
