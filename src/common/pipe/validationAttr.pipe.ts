import { ArgumentMetadata, BadRequestException, Injectable, ParseUUIDPipe, PipeTransform } from "@nestjs/common";
import { UUIDVersion } from "class-validator";
import { Tools } from "../tools/tools";

type Attr = {
 gameId: UUIDVersion
 channelId: UUIDVersion
 areaId: UUIDVersion
 price: number
 pics?: string[]
 name?: string
 sale_attr: Record<`sale_attr_${UUIDVersion}`, string>[] 
 goods_attr?: Record<`goods_attr_${UUIDVersion}`, string>[] 
}

@Injectable()
export class ValidationAttr implements PipeTransform {
  transform(value: Attr, metadata: ArgumentMetadata) {
    const tools = new Tools()
    const exceptParams = ['gameId', 'channelId', 'areaId', 'price', 'pics', 'name', 'sale_attr', 'goods_attr']
    const absentKey = Object.keys(value).filter(key => !exceptParams.includes(key))
    if (Array.isArray(absentKey) && absentKey.length !== 0) {
      throw new BadRequestException(`参数校验失败, 传入参数${absentKey}不正确`)
    }

    const {gameId, channelId, areaId, sale_attr, goods_attr, price, pics, name} = value || {}
    const regex = /^sale_attr_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i
    const GoodsAttrRegex = /^goods_attr_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i
    
    const UUIDRegex = /^[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}$/i
    
    const URLRegex = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
    
    if (!UUIDRegex.test(String(gameId)) || !UUIDRegex.test(String(channelId)) || !UUIDRegex.test(String(areaId))) {
      throw new BadRequestException('参数校验失败, id应该是uuid')
    }
    
    if (typeof price !== 'number') {
      throw new BadRequestException('price参数应该是一个数字')
    }
    
    if (name && typeof name !== 'string') {
      throw new BadRequestException('name参数应该是一个字符串')
    }
    
    if (tools.isNull(pics)) {
      for (let index = 0; index < pics!.length; index++) {
        const element = pics![index];
        if (!URLRegex.test(element)) {
          throw new BadRequestException('pics参数校验失败')
        }
      }
    }

    
    for (let index = 0; index < sale_attr.length; index++) {
      const element = sale_attr[index];
      for (const key in element) {
        if (!regex.test(key)) {
          throw new BadRequestException('sale_attr参数验证失败')
        }
      }
    }
    
    if (!tools.isNull(goods_attr)) {
      for (let index = 0; index < goods_attr!.length; index++) {
        const element = goods_attr![index];
        for (const key in element) {
          if (!GoodsAttrRegex.test(key)) {
            throw new BadRequestException('goods_attr参数验证失败')
          }
        }
      }
    }
    return value;
  }
}