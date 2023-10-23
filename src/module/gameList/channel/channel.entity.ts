import { UUIDVersion } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AreaEntity } from "../area/area.entity";
import { GameListEntity } from "../gameList.entity";

@Entity({name: 'channel'})
export class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion
  
  @Column({type: 'varchar', default: ''})
  name: string;
  
  @Column({type: 'varchar', default: '安卓'})
  system: string;
  
  @Column({type: 'int', default: 0})
  sort: number;
  
  @CreateDateColumn()
  createdTime: Date;
  
  @UpdateDateColumn()
  updatedTime: Date;
  
  // 渠道与区服是一对多关系
  @OneToMany(() => AreaEntity, area => area.channel)
  area: AreaEntity[]
  
  // 渠道与游戏是多对一关系
  @ManyToOne(() => GameListEntity, gameList => gameList.channel)
  gameList: GameListEntity
}