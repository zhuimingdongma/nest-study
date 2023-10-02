import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import {validate} from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, {metatype}: ArgumentMetadata) {
    if (this.validation(metatype!) || !metatype) {
      return value;
    }
    const object = plainToInstance(metatype, value)
    const error = await validate(object)
    if (error.length > 0) {
      throw new BadRequestException('Validation failed')
    }
    return value;
  }
  
  private validation(fn: Function) : boolean {
    const types: Function[] = [Object, Array, String, Number, Boolean]
    return types.includes(fn) 
  }
}