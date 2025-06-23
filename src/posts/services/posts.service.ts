import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    // Injecting Post Repository
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    // Injecting Users Service
    private readonly usersService: UsersService,
  ) {}

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

  public async createPost(dto: CreatePostDto) {
    // let newPost = this.postRepo.create(dto);
    // newPost = await this.postRepo.save(newPost);
    // return newPost;
  }
}
