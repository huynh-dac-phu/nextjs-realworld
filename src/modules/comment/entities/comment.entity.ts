import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  article_id: number;

  @Column()
  author_id: number;

  @ManyToOne(() => User, user => user)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  body: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
