import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';
import RedisJsonModule from '@redis/json';
import { Tools } from 'src/common/tools/tools';

export type RedisCommandArgument = string | Buffer;
export type RedisCommandArguments = Array<RedisCommandArgument> & {
  preserve?: unknown;
};

interface RedisJSONArray extends Array<RedisJSON> {}

interface RedisJSONObject {
  [key: string]: RedisJSON;
  [key: number]: RedisJSON;
}

export interface ZMember {
  score: number;
  value: RedisCommandArgument;
}

export type RedisJSON =
  | null
  | boolean
  | number
  | string
  | Date
  | RedisJSONArray
  | RedisJSONObject;
  
  type Types = RedisCommandArgument | number;

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

  public async set(
    key: string,
    value: number | RedisCommandArgument,
    expire?: number,
  ) {
    if (expire) await this.expire(key, expire);
    const result = await this.client.set(key, value);
    return result;
  }

  public async get(key: string, expire: number = 5) {
    await this.client.expire(key, expire!);
    return await this.client.get(key);
  }

  public async del(key) {
    return await this.client.del(key);
  }

  public async gatherSmembers(key: string, expire: number = 5) {
    await this.client.expire(key, expire!);
    return await this.client.sMembers(key);
  }

  public async gatherSADD(
    key: string,
    set: RedisCommandArgument[] | RedisCommandArgument,
  ) {
    const result = await this.client.SADD(key, set);
    return result;
  }

  public async setJSON(key: string, json: RedisJSON, expire?: number) {
    if (expire) await this.expire(key, expire);
    const result = this.client.json.set(key, '$', json);
    return result;
  }

  public async getJSON(key: string): Promise<any> {
    // await this.client.expire(key, expire!);
    return this.client.json.get(key);
  }

  public async deleteJSON(key: string) {
    // this.client.expire()
    return this.client.json.DEL(key);
  }

  public async increment(key: string, expire?: number) {
    if (expire) await this.client.expire(key, expire);
    return await this.client.incr(key);
  }

  public async deleteOrUpdateRedisJSON(key: string) {
    const value = await this.getJSON(key);
    if (!new Tools().isNull(value)) {
      await this.deleteJSON(key);
      return true;
    }
  }

  public async deleteOrUpdateRedis(key: string) {
    const value = await this.get(key);
    if (!new Tools().isNull(value)) await this.del(key);
    return true;
  }
  
  // 有序列表set

  public async ZADD<T>(key: string, members: ZMember | ZMember[]) {
    return await this.client.zAdd(key, members);
  }

  public async zRange(key: string, start: number, end: number) {
    return await this.client.zRange(key, start, end);
  }
  
  public async zScore(key: string, value) {
    return await this.client.zScore(key, value)
  }
  
  // hash
  public async hSet(key: string, field: Types, value: Types) {
    return await this.client.hSet(key, field, value)
  }
  
  public async hScan(key: string, match: string) {
    return await this.client.hScan(key, 0, {MATCH: match})
  }

  // list链表
  public async rPush(key: string, list) {
    return await this.client.rPush(key, list)
  } 
  
  public async lSet(key: string, index: number, value) {
    return await this.client.lSet(key, index, value)
  }
  
  // public async range(key: string) {
  //   return await this.client.range
  // }
  
  public async lRange(key: string, start: number, end: number) {
    return await this.client.lRange(key, start, end)
  }
  
  
  
  public async TTL(key: string) {
    return await this.client.TTL(key);
  }

  public async expire(key: string, time: number) {
    return await this.client.expire(key, time);
  }
}
