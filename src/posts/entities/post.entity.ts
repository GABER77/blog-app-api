import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postTypeEnum } from '../enums/postType.enum';
import { postStatusEnum } from '../enums/postStatus.enum';
import { MetaOption } from 'src/posts/entities/meta-option.entity';
import { User } from 'src/users/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'enum', enum: postTypeEnum })
  postType: postTypeEnum;

  @Column({ type: 'enum', enum: postStatusEnum })
  status: postStatusEnum;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    cascade: true, // Automatically Creates MetaOption when a Post is created
    eager: true, // Automatically load MetaOption whenever a Post is fetched
  })
  metaOptions?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
