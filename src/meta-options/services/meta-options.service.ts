import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptonsDto } from '../dtos/create-post-meta-options.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepo: Repository<MetaOption>,
  ) {}

  public async create(createDto: CreatePostMetaOptonsDto) {
    const newMetaOption = this.metaOptionsRepo.create(createDto);
    return await this.metaOptionsRepo.save(newMetaOption);
  }
}
