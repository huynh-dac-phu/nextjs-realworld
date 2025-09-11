import { User } from '@/modules/users/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('user_follow')
export class UserFollow {
  @PrimaryColumn({ name: 'follower_id' })
  follower_id: number;

  @PrimaryColumn({ name: 'following_id' })
  following_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'following_id' })
  following: User;

  @CreateDateColumn()
  follow_at: Date;

  @DeleteDateColumn()
  delete_at?: Date;
}
