import { UUIDVersion } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'gameList'})
export class GameListEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion
  
  @Column({length: 20})
  name: string;
  
  @Column()
  icon: string;
  
  @CreateDateColumn()
  created: Date;
  
  @UpdateDateColumn()
  updated: Date;
}