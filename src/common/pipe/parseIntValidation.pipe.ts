import { Injectable,BadRequestException } from "@nestjs/common";
import { ArgumentMetadata, PipeTransform } from "@nestjs/common/interfaces/features/pipe-transform.interface";

@Injectable()
export class ParseIntValidationPipe implements PipeTransform<string,number> {
  transform(value: any, metedata: ArgumentMetadata) {
    const val = parseInt(value.age, 10)
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed')
    }
    return value;
  }
}