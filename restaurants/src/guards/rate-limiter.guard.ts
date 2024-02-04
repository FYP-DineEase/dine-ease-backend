import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RateLimitExceededException } from 'src/exceptions/rate-limit.exception';
import {
  RATE_LIMIT_KEY,
  RateLimitConfig,
} from 'src/decorators/rate-limit.decorator';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rateLimitConfig = this.reflector.get<RateLimitConfig>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    const { keyPrefix, limit, duration, errorMessage } = rateLimitConfig;
    const key = this.generateRateLimitKey(request, keyPrefix);
    const currentHits = await this.redisService.getValue(key);

    if (!currentHits) {
      await this.redisService.setValue(key, 1, duration);
    } else if (currentHits < limit) {
      await this.redisService.updateValue(key, currentHits + 1);
    } else {
      throw new RateLimitExceededException(errorMessage);
    }

    return true;
  }

  private generateRateLimitKey(request: any, keyPrefix: string): string {
    const clientIp = request.ip;
    return `hits:${keyPrefix}:${clientIp}`;
  }
}
