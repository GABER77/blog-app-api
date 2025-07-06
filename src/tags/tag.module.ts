import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagService } from './services/tag.service';

@Module({
  controllers: [TagController],
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService],
  exports: [TagService, TypeOrmModule],
})
export class TagModule {}
