import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  getClient(): RedisClientType {
    return this.redisClient;
  }

  // sets the value
  async setValue(key: string, value: any): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value));
  }

  // only returns value
  async getValue(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    if (!value) return null;
    return JSON.parse(value);
  }

  // update value with key
  async deleteValue(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  // retrieve all values
  async getAllValues(): Promise<any[]> {
    const keys = await this.redisClient.keys('*');
    const values: any[] = [];

    if (keys.length === 0) return values;

    for (const key of keys) {
      const value = await this.getValue(key);
      values.push({ key, value });
    }

    return values;
  }
}
