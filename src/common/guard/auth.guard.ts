import { CanActivate, ExecutionContext } from "@nestjs/common/interfaces";
import { Injectable } from "@nestjs/common/decorators/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express";
import { UnauthorizedException } from "@nestjs/common";
import { jwtConstants } from "src/module/user/jwt.constants";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC, Public } from "../decorator/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService:JwtService, private reflector: Reflector) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean>{
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request)
    if (!token) throw new UnauthorizedException();
    try {
      const verifiedToken = await this.jwtService.verifyAsync(token, {secret: jwtConstants.secret})
      request['user'] = verifiedToken;
    }
    catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
  
  private extractTokenFromHeader(request: Request) {
    const [prefix, token] = request.headers.authorization?.split(" ")?? [''];
    return prefix === 'Bearer' ? token : undefined;
  }
}