import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postTypeEnum } from './enums/postType.enum';
import { postStatusEnum } from './enums/postStatus.enum';
import { MetaOption } from 'src/meta-options/meta-option.entity';

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

  @OneToOne(() => MetaOption)
  @JoinColumn()
  metaOptions?: MetaOption;

  @CreateDateColumn()
  createdAt: Date;
}
