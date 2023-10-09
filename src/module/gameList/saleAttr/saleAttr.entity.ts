import { UUIDVersion } from "class-validator";
import { FormTypeEnum, SaleAttrTypeEnum } from "src/common/enum/public.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GameListEntity } from "../gameList.entity";

@Entity({name: 'sale_attr'})
export class SaleAttrEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion
  
  @Column({type: 'varchar', length: 255})
  name: string;
  
  @Column('int')
  type: FormTypeEnum
  
  @Column('int')
  saleAttrType: SaleAttrTypeEnum
  
  @Column({type: 'varchar', length: 255})
  value: number | string;
  
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
  
  @ManyToOne(() => GameListEntity, gameList => gameList.saleAttr)
  gameList: GameListEntity
}