import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { OrderService } from './order.service';
import { OrderViewDto } from './dto/order_view.dto';
import { OrderUpdateDto } from './dto/order_update.dto';

@Controller('/order')
export class OrderController {
  constructor(private OrderService: OrderService) {}
  @Auth(AuthEnum.ADMIN)
  @Post('/all')
  async getAll(@Body() orderViewDto: OrderViewDto) {
    return await this.OrderService.view(orderViewDto);
  }
  
  @Auth(AuthEnum.ADMIN)
  @Post('/update')
  async update(@Body() orderUpdateDto: OrderUpdateDto) {
    return await this.OrderService.update(orderUpdateDto)
  }
}
