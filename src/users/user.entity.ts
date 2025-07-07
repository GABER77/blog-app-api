import { Post } from 'src/posts/entities/post.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 40 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photo: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @BeforeInsert() // It runs automatically before the entity is first inserted into the database
  protected setPasswordChangedAt() {
    this.passwordChangedAt = new Date();
  }
}
