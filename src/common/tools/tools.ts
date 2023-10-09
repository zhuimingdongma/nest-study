import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import {NotFoundException} from '@nestjs/common'
import { UUIDVersion } from "class-validator";
import { Role } from "src/module/role/role.entity";
import { jwtConstants } from "src/module/user/jwt.constants";
import { User } from "src/module/user/user.entity";
import { Repository } from "typeorm";

export class Tools {
  constructor() {}
  
  async parseToken(token: string, jwtService: JwtService) {
    try {
      const verifiedToken = await jwtService.verifyAsync(this.extractToken(token), {secret: jwtConstants.secret})
      return verifiedToken
    }
    catch (err) {
      return new NotFoundException(err);
    }
  }
  
  isNull(obj: any) {
    const type = this.getType(obj)
    if ((type === "String" || type === "Number" || type === "Boolean") && !obj) return true
    if (obj === null || obj === undefined) return true
    if (type === "Array" && obj.length === 0) return true
    if (type === "Object") {
      for (const key in obj) {
        if (obj.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true
    }
    return false;
  }
  
  getType(obj: unknown) {
    const str = Object.prototype.toString.call(obj).split(' ')[1]
    return str.substring(0, str.length - 1)
  }
  
  private extractToken(token: string) {
    return token.split(" ")[1]
  }
}

