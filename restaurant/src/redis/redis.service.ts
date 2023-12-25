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

  async setValue(key: string, value: any, ttl: number): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), { EX: ttl });
  }

  async getValue(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    if (!value) return null;
    return JSON.parse(value);
  }

  async deleteValue(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

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
  ): Promise<any> {
    let value = await this.getValue(key);
    if (!value) {
      value = await fetchValue();
      await this.setValue(key, value, ttl);
    }
    return value;
  }

  async setNestedValue(
    key: string,
    childKey: string,
    value: any,
  ): Promise<void> {
    const multi = this.redisClient.multi();
    multi.get(key);
    multi.ttl(key);

    const result = await multi.exec();
    const resultValue = result[0];
    const ttl = Number(result[1]);

    if (!resultValue) {
      const resultData = resultValue;
      resultData[childKey] = value;

      await this.setValue(key, resultData, ttl);
    }
  }

  async getNestedValue(primary: string, secondary: string): Promise<any> {
    const value: string = await this.redisClient.get(primary);
    if (!value) return null;
    const result = JSON.parse(value);
    return result[secondary];
  }

  async deleteNestedValue(key: string, childKey: string): Promise<void> {
    const existingData: string = await this.redisClient.get(key);
    if (!existingData) return;

    const ttl = await this.redisClient.ttl(key);
    const data = JSON.parse(existingData);
    if (data.hasOwnProperty(childKey)) {
      delete data[childKey];
      await this.setValue(key, JSON.stringify(data), ttl);
    }
  }
}
