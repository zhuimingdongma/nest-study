import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class rolesGuard implements CanActivate {
  canActivate(ctx:ExecutionContext) : boolean | Promise<boolean> {
    return false
  }
}