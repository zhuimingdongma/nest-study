import { UUIDVersion } from "class-validator";
import { GoodsLevelEnum, GoodsSaleStatusEnum } from "src/common/enum/public.enum";
import { Column, CreateDateColumn, Entity, IsNull, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'goods'})
export class GoodsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;
  
  @Column('uuid')
  gameId: UUIDVersion
  
  @Column('uuid')
  channelId: UUIDVersion
  
  @Column('uuid')
  areaId: UUIDVersion
  
  // 数组
  @Column({type: 'varchar', nullable: true})
  pics: string[]
  
  @Column('int')
  price: number;
  
  @Column('int')
  no: number;
  
  @Column('int')
  status: GoodsSaleStatusEnum;
  
  // 数组
  @Column({type: 'varchar', nullable: true})
  label: string[];
  
  @Column('int')
  level: GoodsLevelEnum
  
  @Column({type: 'date', nullable: true})
  shelf_time: Date;
  
  @Column({type: 'varchar'})
  name: string;
  
  @Column({type: 'varchar', nullable: true})
  goods_attr: Record<`goods_attr${UUIDVersion}`, string>[];
  
  @Column({type: 'varchar'})
  sale_attr: Record<`sale_attr${UUIDVersion}`, string>[];
  
  @CreateDateColumn()
  createdTime: Date;
  
  @UpdateDateColumn()
  updatedTime: Date;
}