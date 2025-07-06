import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TagService } from './services/tag.service';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAllTags(): Promise<Tag[]> {
    return await this.tagService.findAllTags();
  }

  @Post()
  async createTags(@Body() createTagDto: CreateTagDto): Promise<Tag[]> {
    return await this.tagService.createTags(createTagDto);
  }

  @Delete(':id')
  async deleteTag(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.tagService.deleteTag(id);
  }
}
