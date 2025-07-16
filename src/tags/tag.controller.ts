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
import {
  SwaggerCreateTags,
  SwaggerDeleteTag,
  SwaggerFindAllTags,
} from 'src/common/swagger/tag.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @SwaggerFindAllTags()
  async findAllTags(): Promise<Tag[]> {
    return await this.tagService.findAllTags();
  }

  @Post()
  @SwaggerCreateTags()
  async createTags(@Body() createTagDto: CreateTagDto): Promise<Tag[]> {
    return await this.tagService.createTags(createTagDto);
  }

  @Delete(':id')
  @SwaggerDeleteTag()
  async deleteTag(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.tagService.deleteTag(id);
  }
}
