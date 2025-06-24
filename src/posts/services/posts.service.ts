import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    private readonly usersService: UsersService,
  ) {}

  public async getAllPosts(userId: string) {
    const posts = await this.postRepo.find();
    return posts;
  }

  public async createPost(dto: CreatePostDto) {
    const newPost = this.postRepo.create(dto);
    return await this.postRepo.save(newPost);
  }
}
