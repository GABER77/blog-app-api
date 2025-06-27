// src/tags/services/tags.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  public async findAllTags(): Promise<Tag[]> {
    return await this.tagRepo.find();
  }

  public async findTagsByNames(tagNames: string[]): Promise<Tag[]> {
    // Remove duplicate names
    const inputTags = Array.from(new Set(tagNames));

    // Find all tags that match any of the names
    const existingTags = await this.tagRepo.find({
      where: inputTags.map((tag) => ({ tag })),
    });

    return existingTags;
  }

  public async createTags(dto: CreateTagDto): Promise<Tag[]> {
    // Remove duplicate names
    //new Set(tags) creates a Set, which only keeps unique values
    //Array.from(...) turns the Set back into an array
    const inputTags = Array.from(new Set(dto.tags));
    const createdTags: Tag[] = [];

    for (const tag of inputTags) {
      // Check if tag with the given name already exists
      const exists = await this.tagRepo.findOne({ where: { tag } });

      // If it doesn't exist, create and save the new tag
      if (!exists) {
        const newTag = this.tagRepo.create({ tag });
        await this.tagRepo.save(newTag);
        createdTags.push(newTag);
      }
    }

    // Return only the newly created tags
    return createdTags;
  }
}
