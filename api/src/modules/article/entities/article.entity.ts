import { Favorite } from '@/modules/favorite/entities/favorite.entity';
import { User } from '@/modules/users/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
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
  OneToMany,
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

  @Column()
  @IsNotEmpty()
  user_id: number;

  @ManyToOne(() => User, user => user, { eager: false })
  @JoinColumn({ name: 'user_id' })
  author: User;

  @OneToMany(() => Favorite, favorite => favorite.article)
  favorites: Favorite[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  delete_at: Date;

  @Column('simple-array', { nullable: true })
  tagList: string[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
}
