import {Controller, UseGuards, Post, Body, UseInterceptors} from "@nestjs/common";
import { checkAuthGuard } from "src/common/guard/check_auth.guard";
import { GameListAddDto } from "./dto/gameList_add.dto";
import { GameListService } from "./gameList.service";
import { Roles } from "src/common/decorator/role.decorator";
import { GameListDto } from "./dto/gameList.dto";
import { ResponseInterceptor } from "src/common/interceptor/response.interceptor";

@Controller("/game/list")
export class GameListController {
  constructor(private gameListService: GameListService) {}
  
  @Roles(['admin', 'super'])
  @UseGuards(checkAuthGuard)
  @Post("/add")
  async add(@Body() gameListAddDto: GameListAddDto) {
    return await this.gameListService.add(gameListAddDto)
  }
  
  @Roles(['admin', 'super'])
  @UseGuards(checkAuthGuard)
  @UseInterceptors(new ResponseInterceptor())
  @Post("/update")
  async update(@Body() gameListUpdateDto: GameListDto) {
    return await this.gameListService.update(gameListUpdateDto)
  }
}