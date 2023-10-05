import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsUUID, UUIDVersion } from "class-validator";
import { MenuEntity } from "src/module/menu/menu.entity";
import { Permission } from "src/module/permission/permission.entity";
import { DataSource, Repository } from "typeorm";


export class PermissionMenu {
  
  constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}
  
  /**
   * 
   * @param id 权限Id
   * @returns 权限menus
   */
  async getMenu(id: UUIDVersion) {
    if (IsUUID(id)) {
      // const menu = await this.permissionRepository.createQueryBuilder('permission').leftJoinAndSelect("permission.menu", "menu").where("permission.id = :id", {id}).printSql().getMany()
      let list = await this.permissionRepository.find({relations: {menu: true}})
      return list.find(item => item.id === id) 
    }
    else {
      // return new HttpException("用户id不正确", HttpStatus.ACCEPTED)
    }
  }
}