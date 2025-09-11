import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: 'admin' | 'user' | 'viewer';
}

export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
}
