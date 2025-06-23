import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreatePostMetaOptonsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './services/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    @Inject()
    private readonly metaOptionsService: MetaOptionsService,
  ) {}

  @Post()
  public create(@Body() createDto: CreatePostMetaOptonsDto) {
    return this.metaOptionsService.create(createDto);
  }
}
