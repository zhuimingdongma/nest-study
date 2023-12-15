import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentAddDto } from './dto/payment_add.dto';
import { IPRequest, UserRequest } from 'src/common/types/global';
import { Public } from 'src/common/decorator/public.decorator';
import { PaymentCheckDto } from './dto/payment_check.dto';
import { PaymentUpdateDto } from './dto/payment_update.dto';
import { PaymentDelDto } from './dto/payment_del.dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { PaymentViewDto } from './dto/payment_view.dto';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('/payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post('/add')
  @ApiBody({ type: [PaymentAddDto] })
  async add(@Body() paymentAddDto: PaymentAddDto, @Req() request: UserRequest) {
    return await this.paymentService.add(paymentAddDto, request);
  }

  @Post('/update')
  @ApiBody({ type: [PaymentUpdateDto] })
  async update(
    @Body() paymentUpdateDto: PaymentUpdateDto,
    @Req() request: UserRequest,
  ) {
    return await this.paymentService.update(paymentUpdateDto, request);
  }

  @Post('/check')
  @ApiBody({ type: [PaymentCheckDto] })
  async check(@Body() paymentCheckDto: PaymentCheckDto) {
    const { bank_number } = paymentCheckDto;
    return await this.paymentService.check(bank_number);
  }

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @Delete('/del')
  @ApiQuery({ type: [PaymentDelDto] })
  async delete(@Query() paymentDelDto: PaymentDelDto) {
    return await this.paymentService.delete(paymentDelDto);
  }

  @Get('/find')
  @ApiQuery({ type: [PaymentViewDto] })
  async findOne(
    @Query() paymentViewDto: PaymentViewDto,
    @Req() req: UserRequest,
  ) {
    return await this.paymentService.view(paymentViewDto, req);
  }
}
