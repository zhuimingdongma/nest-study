import { UUIDVersion } from 'class-validator';
import { OrderStatusEnum } from 'src/common/enum/public.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'varchar' })
  goodsNo: string;

  @Column({ type: 'varchar' })
  no: string;

  // @Column({ type: 'varchar' })
  // name: string;

  @Column({ type: 'double' })
  price: number;

  @Column('uuid')
  gameId: UUIDVersion;

  @Column('uuid')
  channelId: UUIDVersion;

  @Column('uuid')
  areaId: UUIDVersion;

  @Column('uuid')
  goodsId: UUIDVersion;

  @Column('uuid')
  seller_id: UUIDVersion;

  @Column('uuid')
  buyer_id: UUIDVersion;

  @Column({ type: 'json', nullable: true })
  pics: string[];

  @Column('varchar')
  status: OrderStatusEnum;

  @Column({ type: 'datetime', nullable: true })
  status_update_time: Date;

  @Column({ type: 'double' })
  service_fee: number;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
