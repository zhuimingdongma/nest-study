import { AuthEnum } from "../enum/public.enum";
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common/decorators";
import { checkAuthGuard } from "../guard/check_auth.guard";
import { AuthGuard } from "../guard/auth.guard";

export function Auth(...roles: AuthEnum[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard, checkAuthGuard))
}