import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'user_collect' })
export class CollectEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('uuid')
  goodsId: UUIDVersion;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @ManyToOne(() => User, (User) => User.collect)
  user: User;
}
