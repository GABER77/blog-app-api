import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(): Promise<Tag[]> {
    return await this.tagsService.findAll();
  }

  @Post('bulk')
  async findOrCreateTags(@Body('names') names: string[]): Promise<Tag[]> {
    return await this.tagsService.findOrCreateByNames(names);
  }
}
