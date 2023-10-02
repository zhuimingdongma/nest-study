import { BadRequestException } from "@nestjs/common";
import { ArgumentMetadata, PipeTransform } from "@nestjs/common/interfaces/features/pipe-transform.interface";
import { ZodObject } from "zod";


export class ZodValidationPipe implements PipeTransform {
  constructor(readonly schema: ZodObject<any>) {}
  
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value)
    }
    catch(err) {
      throw new BadRequestException('Validation failed')
    }
    return value;
  }
}