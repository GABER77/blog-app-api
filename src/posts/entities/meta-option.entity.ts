import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Meta_options')
export class MetaOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' }) // Faster than json and supports indexing
  data: Record<string, any>; // Allows dynamic key-value pairs

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
