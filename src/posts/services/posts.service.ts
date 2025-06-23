import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionsRepo: Repository<MetaOption>,

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

  public async createPost(@Body() dto: CreatePostDto) {
    const metaOptions = dto.metaOptions
      ? this.metaOptionsRepo.create(dto.metaOptions)
      : null;

    if (metaOptions) await this.metaOptionsRepo.save(metaOptions);

    let newPost = this.postRepo.create({
      ...dto,
      metaOptions: metaOptions || undefined,
    });

    newPost = await this.postRepo.save(newPost);
    return newPost;
  }
}
