import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "../photo/photo.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  account: string;
  
  @Column({default: '哒哒哒'})
  nickname?: string;
  
  @Column()
  password: string;
  
}