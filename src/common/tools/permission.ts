import { InjectRepository } from "@nestjs/typeorm";
import { UUIDVersion } from "class-validator";
import { Role } from "src/module/role/role.entity";
import { User } from "src/module/user/user.entity";
import { Repository } from "typeorm";
import { Tools } from "./tools";
import {NotFoundException, ForbiddenException} from '@nestjs/common'


export class Permission {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Role) private roleRepository: Repository<Role>) {}

    /**
   * 
   * @param id 用户id
   * @returns 用户权限
   */
    async extractUserPermission(id: UUIDVersion) {
      try {
        const {roles} = await this.userRepository.createQueryBuilder("user").leftJoinAndSelect("user.roles", "role").where("user.id = :id", {id}).getOne() || {}
        if (roles) {
          const id = roles[0].id
          let permissions = await this.roleRepository.find({relations:{permission: true}})
          if (!new Tools().isNull(permissions)) {
            const permission = permissions.find(item => item.id === id)?.permission
            if (permission && permission[0]) {
              return permission[0]
            }
            else {
              return new NotFoundException('暂无权限')
            }
          }
        }
        return new NotFoundException('暂无该用户')  
      }
      catch (err) {
        return new ForbiddenException(err)
      }

    }
}