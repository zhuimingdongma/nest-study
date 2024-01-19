import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelEntity } from '../channel/channel.entity';
import { UUIDVersion } from 'class-validator';

@Entity({ name: 'area' })
export class AreaEntity {
  @Index('areaId', { unique: true })
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Index('name')
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  @Index('areaSort')
  sort: number;

  @ManyToOne(() => ChannelEntity, (channel) => channel.area)
  @Index('channel', { synchronize: false })
  channel: ChannelEntity;
}
