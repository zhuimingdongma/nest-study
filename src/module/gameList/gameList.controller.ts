import {Controller, UseGuards, Post, Body, UseInterceptors, Get, Param, Query } from "@nestjs/common";
// import {Params} from "@nestjs/de"
import { checkAuthGuard } from "src/common/guard/check_auth.guard";
import { GameListAddDto } from "./dto/gameList_add.dto";
import { GameListService } from "./gameList.service";
import { Roles } from "src/common/decorator/role.decorator";
import { GameListDto } from "./dto/gameList.dto";
import { ResponseInterceptor } from "src/common/interceptor/response.interceptor";
import { UUIDVersion } from "class-validator";
import { Public } from "src/common/decorator/public.decorator";
import { GameListLookDto } from "./dto/gameList_look.dto";
import { Auth } from "src/common/decorator/auth.decorator";
import { AuthEnum } from "src/common/enum/public.enum";
import { GameListFilterDto } from "./dto/gameList_filter.dto";

@Controller("/game/list")
@UseInterceptors(new ResponseInterceptor())
export class GameListController {
  constructor(private gameListService: GameListService) {}
  
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @Post("/add")
  async add(@Body() gameListAddDto: GameListAddDto) {
    return await this.gameListService.add(gameListAddDto)
  }
  
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @Post("/update")
  async update(@Body() gameListUpdateDto: GameListDto) {
    return await this.gameListService.update(gameListUpdateDto)
  }
  
  @Roles(['admin', 'super'])
  @UseGuards(checkAuthGuard)
  @Post("/del")
  async delete(@Body() id: UUIDVersion) {
    return await this.gameListService.delete(id)
  }
  
  // @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @Post("/query")
  @Public()
  async getList(@Body() gameListLookDto: GameListLookDto) {
    return await this.gameListService.query(gameListLookDto)
  }
  
  @Get("/filter")
  @Public()
  async filterItems(@Query() gameListFilterDto: GameListFilterDto) {
    return await this.gameListService.filterItems(gameListFilterDto)
  }
}