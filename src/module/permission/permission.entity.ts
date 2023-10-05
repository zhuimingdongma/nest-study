import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../role/role.entity";
import { MenuEntity } from "../menu/menu.entity";
import { UUIDVersion } from "class-validator";

@Entity({name: 'permission'})
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;
  
  @Column()
  name: string;
  
  @ManyToMany(() => Role, role => role.permission)
  role: Role[]
  
  @ManyToMany(() => MenuEntity, menu => menu.permission)
  menu: MenuEntity[]
}