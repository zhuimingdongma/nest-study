import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Permission } from "../permission/permission.entity";
import { UUIDVersion } from "class-validator";

@Entity({name: 'role'})
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;
  
  @Column()
  name: string;
  
  @ManyToMany(() => User, user => user.roles)
  user: User[]
  
  @ManyToMany(() => Permission, permission => permission.role)
  @JoinTable({name: 'role_permission'})
  permission: Permission[]
}