import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentAddDto } from './dto/payment_add.dto';
import { IPRequest, UserRequest } from 'src/common/types/global';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPaymentEntity } from './payment.entity';
import { Repository } from 'typeorm';
import { Tools } from 'src/common/tools/tools';
import { LogService } from '../log/log.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '../redis/redis.service';
import { PaymentUpdateDto } from './dto/payment_update.dto';
import { User } from '../user/user.entity';
import { PaymentDelDto } from './dto/payment_del.dto';
import { PaymentViewDto } from './dto/payment_view.dto';
import { BankStatus } from 'src/common/enum/public.enum';

@Injectable()
export class PaymentService {
  private tools = new Tools();
  constructor(
    @InjectRepository(UserPaymentEntity)
    private userPaymentRepository: Repository<UserPaymentEntity>,
    private logService: LogService,
    private httpService: HttpService,
    private redisService: RedisService,
  ) {}
  public async add(paymentAddDto: PaymentAddDto, request: UserRequest) {
    try {
      const {
        user: { username, sub },
      } = request;
      const { bank_name, bank_number, bank_of } = paymentAddDto;
      const foundBank = await this.userPaymentRepository.findOne({
        where: { bank_number },
      });
      const check = await this.check(bank_number);
      if (
        !this.tools.isNull(check) &&
        (await this.redisService.get(`${bank_number}`))
      ) {
        this.logService.info(`${bank_number}银行卡验证通过`);
      } else {
        this.logService.warn(
          `${bank_number}银行卡号验证未通过或暂未包含该类银行功能`,
        );
        throw new HttpException(
          '银行卡号验证未通过或暂未包含该类银行功能',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!this.tools.isNull(foundBank))
        throw new HttpException('该银行卡已被绑定', HttpStatus.BAD_REQUEST);
      const result = await this.userPaymentRepository
        .createQueryBuilder('userPayment')
        .insert()
        .into(UserPaymentEntity)
        .values({
          bank_name,
          bank_number,
          bank_of,
          status: BankStatus.NORMAL,
        })
        .execute();
      this.userPaymentRepository
        .createQueryBuilder('userPayment')
        .relation(UserPaymentEntity, 'user')
        .of(result.identifiers[0].id)
        .set(sub);
      this.logService.info(`${username}已添加银行卡`);
      return '添加成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async update(
    paymentUpdateDto: PaymentUpdateDto,
    request: UserRequest,
  ) {
    try {
      const { id, bank_name, bank_of, bank_number } = paymentUpdateDto;
      const foundBank = await this.userPaymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.user', 'user')
        .where('payment.id = :paymentId', { paymentId: id })
        .andWhere('user.id = :userId', { userId: request.user.sub })
        .getMany();
      if (this.tools.isNull(foundBank)) {
        throw new NotFoundException('未找到该用户对应银行卡');
      }
      const check = await this.check(bank_number);
      if (this.tools.isNull(check))
        throw new NotFoundException('该卡号对应银行暂不支持,更新失败');
      const { affected } = await this.userPaymentRepository
        .createQueryBuilder('payment')
        .leftJoin('payment.user', 'user')
        .update(UserPaymentEntity)
        .set({ bank_name, bank_of, bank_number })
        .where('id = :paymentId', { paymentId: id })
        .andWhere('user.id = :userId', { userId: request.user.sub })
        .execute();
      if (affected !== 1)
        throw new HttpException(
          '银行卡信息更新失败',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      return '银行卡信息更新成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async delete(paymentDelDto: PaymentDelDto) {
    try {
      const { id } = paymentDelDto;
      const foundBank = await this.userPaymentRepository.findOne({
        where: { id },
      });
      if (this.tools.isNull(foundBank))
        throw new HttpException(
          '未找到该用户绑定的银行卡',
          HttpStatus.NOT_FOUND,
        );
      const { affected } = await this.userPaymentRepository
        .createQueryBuilder()
        .delete()
        .from(UserPaymentEntity)
        .where('payment.id = :paymentId', { paymentId: id })
        .execute();
      if (affected !== 1)
        throw new HttpException('删除失败', HttpStatus.UNPROCESSABLE_ENTITY);
      return '删除成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async view(paymentViewDto: PaymentViewDto, req: UserRequest) {
    try {
      const { id } = paymentViewDto;
      let foundPayment = await this.userPaymentRepository.findOne({
        where: { id },
      });
      if (!this.tools.isNull(foundPayment)) {
        const {
          user: { sub },
        } = req;
        foundPayment = (await this.userPaymentRepository
          .createQueryBuilder('userPayment')
          .relation('userPayment.user', 'user')
          .of(sub)
          .loadOne()) as UserPaymentEntity | null;
      }
      if (this.tools.isNull(foundPayment)) {
        throw new NotFoundException('未找到该用户对应银行卡');
      }
      return foundPayment;
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async check(bank_number: string) {
    const url = `https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo=${bank_number}&cardBinCheck=true`;
    const { data: bankInfo } = await firstValueFrom(this.httpService.get(url));
    const fs = require('fs');
    const path = require('path');
    if (!this.tools.isNull(bankInfo['bank']) && bankInfo['validated']) {
      return new Promise((resolve, reject) => {
        try {
          const filePath = path.join(
            process.cwd(),
            'src/common/json/bank_name.json',
          );
          fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err)
              throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            const key = bankInfo['bank'];
            const check = JSON.parse(data)[key];
            if (!this.tools.isNull(check)) {
              this.redisService.set(`${bank_number}`, JSON.stringify(true));
              resolve(check);
            }
          });
        } catch (err) {
          this.redisService.set(`${bank_number}`, JSON.stringify(false));
          reject(err);
          this.tools.throwError(err);
        }
      });
    } else {
      return false;
    }
  }
}
