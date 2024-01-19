import { UUIDVersion } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentType, PowerBtnType } from './dto/gameList.dto';
import { WhetherEnum } from 'src/common/enum/public.enum';
import { GoodsAttrEntity } from './goodsAttr/goodsAttr.entity';
import { SaleAttrEntity } from './saleAttr/saleAttr.entity';
import { ChannelEntity } from './channel/channel.entity';
import { channel } from 'diagnostics_channel';
import { AreaEntity } from './area/area.entity';

@Entity({ name: 'game_list' })
export class GameListEntity {
  @Index('gameListId', { unique: true })
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Index('gameListName')
  @Column({ length: 20 })
  name: string;

  @Column()
  icon: string;

  // 重要性排序
  @Column()
  sort: number;

  // 价格区间
  @Column({ default: '' })
  price_range: string;

  // 游戏类型 端游/手游
  @Column()
  type: WhetherEnum;

  // 游戏对应经纪人
  @Column({ type: 'json', default: null })
  agentArr: AgentType[];

  // 权限按钮+
  @Column({ type: 'json', default: null })
  btn: PowerBtnType[];

  // 是否显示的 状态
  @Column({ default: 1 })
  status: WhetherEnum;

  @Column('json')
  label: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  // 游戏与出售属性丶商品属性及为一对多 关系
  @OneToMany(() => GoodsAttrEntity, (goodsAttr) => goodsAttr.gameList)
  GoodsAttr: GoodsAttrEntity[];

  @OneToMany(() => SaleAttrEntity, (saleAttr) => saleAttr.gameList)
  saleAttr: SaleAttrEntity[];

  @OneToMany(() => ChannelEntity, (channel) => channel.gameList)
  channel: ChannelEntity[];
}
