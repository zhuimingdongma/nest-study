import { Body, Controller, Get } from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { OrderService } from './order.service';
import { OrderViewDto } from './dto/order_view.dto';

@Controller('/order')
export class OrderController {
  private OrderService: OrderService;
  @Auth(AuthEnum.ADMIN)
  @Get('/all')
  async getAll(@Body() orderViewDto: OrderViewDto) {
    return await this.OrderService.view(orderViewDto);
  }
}
