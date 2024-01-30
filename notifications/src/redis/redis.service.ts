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
  async setValue(key: string, value: any, ttl: number): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), { EX: ttl });
  }

  // only returns value
  async getValue(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    if (!value) return null;
    return JSON.parse(value);
  }

  // returns value with ttl
  async getValueWithTTL(
    key: string,
  ): Promise<{ value: any; ttl: number } | null> {
    const multi = this.redisClient.multi();
    multi.get(key);
    multi.ttl(key);

    const result = await multi.exec();
    const value = String(result[0]);
    const ttl = Number(result[1]);

    if (!value) return null;
    return { value: JSON.parse(value), ttl };
  }

  // update value with key
  async deleteValue(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  // update value with key
  async updateValue(key: string, newValue: any): Promise<void> {
    const multi = this.redisClient.multi();
    multi.get(key);
    multi.ttl(key);

    const result = await multi.exec();
    const value = result[0];
    const ttl = Number(result[1]);

    if (value) {
      await this.setValue(key, newValue, ttl);
    }
  }

  // finds the value if not present then
  // gets the value and stores in cache
  async cacheWrapper(
    key: string,
    ttl: number,
    fetchValue: () => Promise<any>,
  ): Promise<{ value: any; ttl: number }> {
    let data = await this.getValueWithTTL(key);

    if (!data || !data.value) {
      const value = await fetchValue();
      await this.setValue(key, value, ttl);
      data = { value, ttl };
    }

    return data;
  }
}
