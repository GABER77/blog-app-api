import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('Meta_options')
export class MetaOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' }) // Faster than json and supports indexing
  data: Record<string, any>; // Allows dynamic key-value pairs

  @OneToOne(() => Post, (post) => post.metaOptions)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
