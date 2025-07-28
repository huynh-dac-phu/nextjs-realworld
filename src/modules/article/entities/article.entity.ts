import { User } from '@/modules/users/entities/user.entity';
import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 255 })
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @PrimaryColumn({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, user => user, { eager: false })
  @JoinColumn({ name: 'user_id' })
  author: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  delete_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
}
