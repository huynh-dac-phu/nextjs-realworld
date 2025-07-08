import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  user_name: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ length: 255 })
  bio: string = '';

  @Column({ length: 255 })
  avatar: string = '';

  @Column({ length: 255 })
  access_token: string = '';

  @Column({ length: 255 })
  refresh_token: string = '';

  @CreateDateColumn()
  created_at: Date;
}
