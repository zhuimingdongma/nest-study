import {Controller, Post, UseGuards} from '@nestjs/common'
import { Auth } from 'src/common/decorator/auth.decorator'
import { AuthEnum } from 'src/common/enum/public.enum'
import { AuthGuard } from 'src/common/guard/auth.guard'
import { checkAuthGuard } from 'src/common/guard/check_auth.guard'

@Controller('/game/goodsAttr')
export class GoodsAttrController {
  @Post()
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  create() {
    
  }
}