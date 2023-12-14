import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UUIDVersion } from 'class-validator';
import { Role } from 'src/module/role/role.entity';
import { jwtConstants } from 'src/module/user/jwt.constants';
import { User } from 'src/module/user/user.entity';
import { Repository } from 'typeorm';
import { ExcelOperation } from './excel_operation';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/module/redis/redis.service';

export class Tools {
  private crypto;
  private configService: ConfigService = new ConfigService();
  private redisService: RedisService = new RedisService(this.configService);
  private key: string = this.configService.get('ENCRYPT_DEFAULT_KEY')!;
  private iv = this.configService.get('ENCRYPT_DEFAULT_KEY');
  private jwtSecret = this.configService.get('JWT_SECRET');
  constructor() {
    this.crypto = require('crypto-js');
  }

  async parseToken(token: string, jwtService: JwtService) {
    try {
      const verifiedToken = await jwtService.verifyAsync(
        this.extractToken(token),
        { secret: this.jwtSecret },
      );
      return verifiedToken;
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  isNull(obj: any) {
    const type = this.getType(obj);
    if ((type === 'String' || type === 'Number' || type === 'Boolean') && !obj)
      return true;
    if (obj === null || obj === undefined) return true;
    if (type === 'Array' && obj.length === 0) return true;
    if (type === 'Object') {
      for (const key in obj) {
        if (obj.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  public getType(obj: unknown) {
    const str = Object.prototype.toString.call(obj).split(' ')[1];
    return str.substring(0, str.length - 1);
  }

  getUserInfo(id: UUIDVersion) {}

  private extractToken(token: string) {
    return token.split(' ')[1];
  }

  public encrypt(data, keys?: string, ivs?: string) {
    const key = this.crypto.enc.Utf8.parse(keys || this.key);
    const iv = this.crypto.enc.Utf8.parse(ivs || this.iv);
    const src = this.crypto.enc.Utf8.parse(data);
    return this.crypto.DES.encrypt(src, key, {
      iv,
      mode: this.crypto.mode.CBC,
      padding: this.crypto.pad.Pkcs7,
    }).toString();
  }

  public decrypt(data, keys?: string, ivs?: string) {
    const key = this.crypto.enc.Utf8.parse(keys || this.key);
    const iv = this.crypto.enc.Utf8.parse(ivs || this.iv);
    return this.crypto.DES.decrypt(data, key, {
      iv,
      mode: this.crypto.mode.CBC,
      padding: this.crypto.pad.Pkcs7,
    }).toString(this.crypto.enc.Utf8);
  }

  public throwError(error) {
    const {
      status = HttpStatus.INTERNAL_SERVER_ERROR,
      message = '服务器出错',
    } = error;
    throw new HttpException(error || message, status);
  }
}
