import { UUIDVersion } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AgentType, PowerBtnType } from "./dto/gameList.dto";
import { WhetherEnum } from "src/common/enum/public.enum";
import { GoodsAttrEntity } from "./goodsAttr/goodsAttr.entity";
import { SaleAttrEntity } from "./saleAttr/saleAttr.entity";

@Entity({name:'game_list'})
export class GameListEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion
  
  @Column({length: 20})
  name: string;
  
  @Column()
  icon: string;
  
  // 重要性排序
  @Column()
  sort: number;
  
  // 价格区间
  @Column({default: ''})
  price_range: string;
  
  // 游戏类型 端游/手游
  @Column()
  type: WhetherEnum;
  
  // 游戏对应经纪人
  @Column({type: 'json', default: null})
  agentArr: AgentType[]
  
  // 权限按钮+
  @Column({type: 'json', default: null})
  btn: PowerBtnType[]
  
  // 是否显示的 状态
  @Column({default: 1})
  status: WhetherEnum
  
  @Column('json')
  label: string
  
  @CreateDateColumn()
  created: Date;
  
  @UpdateDateColumn()
  updated: Date;
  
  // 游戏与出售属性 及 商品属性为一对多 关系
  @OneToMany(() => GoodsAttrEntity, goodsAttr => goodsAttr.gameList)
  GoodsAttr: GoodsAttrEntity[]
  
  @OneToMany(() => SaleAttrEntity, saleAttr => saleAttr.gameList)
  saleAttr: SaleAttrEntity[]
}