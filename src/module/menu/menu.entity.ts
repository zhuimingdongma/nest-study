import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "../permission/permission.entity";
import { UUIDVersion } from "class-validator";

@Entity({name: 'menu'})
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: UUIDVersion;
  
  @Column({length: 20})
  name: string;
  
  @Column({length: 50})
  path: string;
  
  @Column()
  icon: string;
  
  @ManyToMany(() => Permission, permission => permission.menu)
  @JoinTable({name: 'permission_menu'})
  permission: Permission[]
}