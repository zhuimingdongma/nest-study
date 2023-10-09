import {Body, Controller, Get, Inject, Post, Query} from '@nestjs/common'
import { Auth } from 'src/common/decorator/auth.decorator'
import { AuthEnum } from 'src/common/enum/public.enum'
import { SaleAttrAddDto } from './dto/saleAttr_add.dto';
import { SaleAttrService } from './saleAttr.service';
import { UUIDVersion } from 'class-validator';
import { SaleAttrDelDto } from './dto/saleAttr_del.dto';

@Controller('/game/saleAttr')
export class SaleAttrController {
  
  constructor(private saleAttrService: SaleAttrService ) {}
  @Post('/add')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  
  async add(@Body() saleAttrAddDto: SaleAttrAddDto) {
    return await this.saleAttrService.add(saleAttrAddDto)
  }
  
  @Post('/delete')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  async delete(@Body() saleAttrDelDto: SaleAttrDelDto) {
    const {id} = saleAttrDelDto
    return await this.saleAttrService.delete(id)
  }
  
  @Post('/update')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  async update(saleAttrUpdateDto: SaleAttrAddDto) {
    return await this.saleAttrService.
  }
}