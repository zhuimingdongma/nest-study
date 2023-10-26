import { UUIDVersion } from "class-validator";
import { FormTypeEnum } from "src/common/enum/public.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GameListEntity } from "../gameList.entity";

@Entity({name: 'goods_attr'})
export class GoodsAttrEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion
  
  @Column('varchar')
  name: string;
  
  @Column('int')
  type: FormTypeEnum
  
  @Column({type: 'varchar'})
  value: number | string;
  
  @Column({type: 'json'})
  secondaryAttr: string;
  
  @Column({type: 'double',default: 0})
  minPrice: number;
  
  @Column({type: 'double', default: 500000})
  maxPrice: number;
  
  @Column({type: 'int', default: 0})
  sort: number;
  
  @Column({type: 'boolean', default: false})
  isRequired: boolean;
  
  @CreateDateColumn()
  createdTime: Date
  
  @UpdateDateColumn()
  updateTime: Date
  
  @ManyToOne(() => GameListEntity, gameList => gameList.GoodsAttr)
  gameList: GameListEntity
}