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
  @Column({type: 'json', nullable: true})
  pics: string[];
  
  @Column('int')
  price: number;
  
  @Column('varchar')
  no: string;
  
  @Column({type: 'int', nullable: true})
  sort: number;
  
  @Column('int')
  status: GoodsSaleStatusEnum;
  
  // 数组
  @Column({type: 'json', nullable: true})
  label: string[];
  
  @Column('varchar')
  level: GoodsLevelEnum
  
  @Column({type: 'datetime', nullable: true})
  shelf_time: Date;
  
  @Column({type: 'varchar'})
  name: string;
  
  @Column({type: 'json', nullable: true})
  goods_attr: string;
  
  @Column({type: 'json'})
  sale_attr: string;
  
  @Column({type: 'uuid'})
  seller_id: UUIDVersion
  
  @CreateDateColumn()
  createdTime: Date;
  
  @UpdateDateColumn()
  updatedTime: Date;
}