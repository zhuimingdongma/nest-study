import { Injectable } from "@nestjs/common/decorators/core";
import { Repository } from "typeorm";
import { Role } from "./role.entity";
import { RoleDto } from "./dto/role.dto";

@Injectable()
export class RoleService {
  constructor(private roleRepository: Repository<Role>) {}
  
  create(roleDto: RoleDto) {
    const role = new Role()
    for (const key in roleDto) {
      if (Object.prototype.hasOwnProperty.call(roleDto, key)) {
        const element = roleDto[key];
        role[key] = element;
      }
    } 
    this.roleRepository.save(role)
  }
}
