import { UserFollow } from '@/modules/user-follow/entities/user-follow.entity';
import { UserRole } from '@/modules/user-role/entities/user-role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => UserRole, userRole => userRole.name, { eager: false })
  role: UserRole;

  @OneToMany(() => UserFollow, follow => follow.follower)
  following: UserFollow[];

  @OneToMany(() => UserFollow, follow => follow.following)
  followers: UserFollow[];

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  delete_at?: Date;
}
