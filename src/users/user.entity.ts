import { Exclude } from 'class-transformer';
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

  @Exclude()
  @Column({ nullable: true })
  googleId?: string;

  @Column({ length: 40 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  profileImage: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @BeforeInsert() // It runs automatically before the entity is first inserted into the database
  protected setPasswordChangedAt() {
    this.passwordChangedAt = new Date();
  }
}
