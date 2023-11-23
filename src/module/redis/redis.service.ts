import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';
import RedisJsonModule from '@redis/json';

export type RedisCommandArgument = string | Buffer;
export type RedisCommandArguments = Array<RedisCommandArgument> & {
  preserve?: unknown;
};

interface RedisJSONArray extends Array<RedisJSON> {}

interface RedisJSONObject {
  [key: string]: RedisJSON;
  [key: number]: RedisJSON;
}

export type RedisJSON =
  | null
  | boolean
  | number
  | string
  | Date
  | RedisJSONArray
  | RedisJSONObject;

@Injectable()
export class RedisService {
  private client: RedisClientType<{ json: typeof RedisJsonModule }>;
  constructor(private configService: ConfigService) {
    this.client = createClient({
      socket: {
        host: this.configService.get('REDIS_HOST', '127.0.0.1'),
        port: this.configService.get('REDIS_PORT', 6379),
        connectTimeout: Number(this.configService.get('REDIS_TIMEOUT', 1000)),
      },
    });
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.client.connect();
  }

  async test() {
    try {
      return this.configService.get('REDIS_PORT');
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async set(key: string, value: number | RedisCommandArgument) {
    const result = await this.client.set(key, value);
    return result;
  }

  async get(key: string, expire: number = 5) {
    this.client.expire(key, expire!);
    return await this.client.get(key);
  }

  async setGather(
    key: string,
    set: RedisCommandArgument[] | RedisCommandArgument,
    expire: number = 5,
  ) {
    const result = await this.client.SADD(key, set);
    this.client.expire(key, expire!);
    return result;
  }

  async setJSON(key: string, json: RedisJSON) {
    const result = this.client.json.set(key, '$', json);
    return result;
  }

  async getJSON(key: string, expire: number = 5) {
    this.client.expire(key, expire!);
    return this.client.json.get(key);
  }
}
