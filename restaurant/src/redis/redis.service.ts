import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async setValue(
    userId: string,
    key: string,
    value: any,
    ttl: number,
  ): Promise<void> {
    const existingData: string = await this.redisClient.get(userId);
    const userData = existingData ? JSON.parse(existingData) : {};
    userData[key] = value;
    await this.redisClient.set(userId, JSON.stringify(userData), { EX: ttl });
  }

  async getValue(userId: string, key: string) {
    const value: string = await this.redisClient.get(userId);
    if (!value) return null;
    const result = JSON.parse(value);
    return result[key];
  }

  async deleteValue(userId: string, key: string) {
    const existingData: string = await this.redisClient.get(userId);
    if (!existingData) return;

    const ttl = await this.redisClient.ttl(userId);
    const userData = JSON.parse(existingData);
    if (userData.hasOwnProperty(key)) {
      delete userData[key];
      await this.redisClient.set(userId, JSON.stringify(userData), { EX: ttl });
    }
  }

  // finds the value if not present then
  // gets the value and stores in cache
  async cacheWrapper(
    userId: string,
    key: string,
    ttl: number,
    fetchValue: () => Promise<any>,
  ): Promise<any> {
    let value = await this.getValue(userId, key);
    if (!value) {
      value = await fetchValue();
      await this.setValue(userId, key, value, ttl);
    }
    return value;
  }
}
