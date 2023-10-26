import { UUIDVersion } from "class-validator";
import { GoodsSaleStatusEnum } from "src/common/enum/public.enum";
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
  pic: string[]
  
  @Column('int')
  price: number;
  
  @Column('varchar')
  title: string;
  
  @Column('int')
  no: number;
  
  @Column('int')
  status: number;
  
  // 数组
  @Column({type: 'varchar', nullable: true})
  label: string[];
  
  @Column('int')
  level: GoodsSaleStatusEnum
  
  @Column({type: 'date', nullable: true})
  shelf_time: Date;
  
  @CreateDateColumn()
  createdTime: Date;
  
  @UpdateDateColumn()
  updatedTime: Date;
}