import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAllTags(): Promise<Tag[]> {
    return await this.tagsService.findAllTags();
  }

  @Post()
  async createTags(@Body() createTagDto: CreateTagDto): Promise<Tag[]> {
    return await this.tagsService.createTags(createTagDto);
  }
}
