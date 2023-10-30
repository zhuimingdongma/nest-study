import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../role/role.entity";
import { IsEmail, IsPhoneNumber, UUIDVersion } from "class-validator";

@Entity({name: 'user'})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;
  
  @Column()
  account: string;
  
  @Column({default: '冬马和纱'})
  nickname?: string;
  
  @Column({select: false})
  password: string;
  
  @Column()
  @IsEmail()
  email: string;
  
  @Column()
  @IsPhoneNumber()
  phone: number;
  
  @Column()
  avatar: string;
  
  @Column()
  status: number;
  
  @ManyToMany(() => Role)
  @JoinTable({name: 'user_roles'})
  roles: Role[]
}
