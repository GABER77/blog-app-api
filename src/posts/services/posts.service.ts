import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { In, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../entities/meta-option.entity';
import { TagsService } from 'src/tags/services/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { HandlerFactory } from 'src/common/utils/handler-factory';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepo: Repository<MetaOption>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,

    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  public async getAllPosts(query: Record<string, string>) {
    return HandlerFactory.getAll({
      repo: this.postRepo,
      queryParams: query,
      alias: 'post',
      searchableFields: ['title', 'content'],
    });
  }

  public async createPost(dto: CreatePostDto) {
    const author = await this.usersService.getUser(dto.authorId);
    if (!author) throw new NotFoundException('User not found');

    // Get only tags that defined in the database
    let tags: Tag[] = [];
    if (dto.tags?.length) {
      tags = await this.tagsService.findTagsByNames(dto.tags);
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

  public async updatePost(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepo.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    // Update scalar fields
    this.postRepo.merge(post, {
      title: dto.title ?? post.title,
      postType: dto.postType ?? post.postType,
      status: dto.status ?? post.status,
      slug: dto.slug ?? post.slug,
      content: dto.content ?? post.content,
      imageUrl: dto.imageUrl ?? post.imageUrl,
    });

    // Update tags if provided
    if (dto.tags && dto.tags.length > 0) {
      // Remove duplicate names
      const inputTags = Array.from(new Set(dto.tags));

      // Fetch only tags that already exist in the database
      const tags = await this.tagRepo.find({
        where: { tag: In(inputTags) },
      });

      post.tags = tags;
    }

    // Update metaOptions if provided
    if (dto.metaOptions) {
      if (post.metaOptions) {
        post.metaOptions.data = dto.metaOptions.data;
      } else {
        post.metaOptions = this.metaOptionRepo.create(dto.metaOptions);
      }
    }

    return await this.postRepo.save(post);
  }
}
