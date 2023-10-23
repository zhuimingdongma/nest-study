import { Injectable } from "@nestjs/common/decorators";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "./permission.entity";
import { Repository } from "typeorm";
import { PermissionAddDto } from './dto/permissionAdd.dto';
import { Tools } from "src/common/tools/tools";
import { HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class PermissionService {
  constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}
  
  async add(permissionAddDto: PermissionAddDto) {
    try {
      const {name} = permissionAddDto
      const isExist = await this.permissionRepository.findOne({where: {name}})
      if (new Tools().isNull(isExist)) {
        const repository = await this.permissionRepository.create()
        repository.name = name;
        return await this.permissionRepository.save(repository)
      }
      else {
        return new HttpException('该权限已存在', HttpStatus.FAILED_DEPENDENCY)
      }
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
}