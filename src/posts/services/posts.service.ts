import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../entities/meta-option.entity';
import { privateDecrypt } from 'crypto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepo: Repository<MetaOption>,

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

  public async deletePost(id: string) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['metaOptions'], // this ensures metaOptions is loaded
    });

    if (!post) {
      throw new NotFoundException('No post found with that ID');
    }
    await this.postRepo.delete(id);

    if (post.metaOptions) await this.metaOptionRepo.delete(post.metaOptions.id);
  }
}
