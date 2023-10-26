import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChannelEntity } from "../channel/channel.entity";
import { UUIDVersion } from "class-validator";

@Entity({name: 'area'})
export class AreaEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion
  
  @Column({type: 'varchar'})
  name: string;
  
  @Column({type: 'int'})
  sort: number;
  
  @ManyToOne(() => ChannelEntity, channel => channel.area)
  channel: ChannelEntity

}