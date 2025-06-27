import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../entities/meta-option.entity';
import { TagsService } from 'src/tags/services/tags.service';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepo: Repository<MetaOption>,

    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  public async getAllPosts(userId: string) {
    const posts = await this.postRepo.find();
    return posts;
  }

  public async createPost(dto: CreatePostDto) {
    const author = await this.usersService.getUser(dto.authorId);
    if (!author) throw new NotFoundException('User not found');

    let tags: Tag[] = [];
    if (dto.tags?.length) {
      tags = await this.tagsService.findOrCreateByNames(dto.tags);
    }

    const newPost = this.postRepo.create({
      ...dto,
      author,
      tags,
    });

    return await this.postRepo.save(newPost);
  }

  public async deletePost(id: string) {
    await this.postRepo.delete(id);
  }

  public async getPostByMetaOptionId(metaOptionId: string) {
    const meta = await this.metaOptionRepo.findOne({
      where: { id: metaOptionId },
      relations: ['post'],
    });

    if (!meta || !meta.post) {
      throw new NotFoundException('Post not found for this MetaOption');
    }

    return meta.post;
  }
}
