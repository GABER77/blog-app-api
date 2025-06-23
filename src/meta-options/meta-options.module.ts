import { Module } from '@nestjs/common';
import { MetaOptionsController } from './meta-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { metaOption } from './meta-options.entity';

@Module({
  controllers: [MetaOptionsController],
  imports: [TypeOrmModule.forFeature([metaOption])],
})
export class MetaOptionsModule {}
