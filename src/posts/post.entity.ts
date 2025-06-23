import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postTypeEnum } from './enums/postType.enum';
import { postStatusEnum } from './enums/postStatus.enum';
import { CreatePostMetaOptonsDto } from '../meta-options/dtos/create-post-meta-options.dto';
import { text } from 'stream/consumers';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'enum', enum: postTypeEnum })
  postType: postTypeEnum;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: postStatusEnum })
  status: postStatusEnum;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'json', nullable: true })
  metaOptions?: CreatePostMetaOptonsDto[];

  @CreateDateColumn()
  createdAt: Date;
}
