// src/tags/services/tags.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  public async findAll(): Promise<Tag[]> {
    return await this.tagRepo.find();
  }

  public async findOrCreateByNames(names: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const name of names) {
      let tag = await this.tagRepo.findOneBy({ name }); // ✅ correct usage
      if (!tag) {
        tag = this.tagRepo.create({ name });
        await this.tagRepo.save(tag);
      }
      tags.push(tag);
    }

    return tags;
  }
}
