import { Article } from '@/modules/article/entities/article.entity';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favorite')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  user_id: number;

  @Column()
  @IsNotEmpty()
  article_id: number;

  @ManyToOne(() => Article, article => article.favorites)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @CreateDateColumn()
  @IsNotEmpty()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
