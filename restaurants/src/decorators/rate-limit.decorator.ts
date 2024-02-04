import { SetMetadata } from '@nestjs/common';

export interface RateLimitConfig {
  keyPrefix: string;
  limit?: number;
  duration?: number;
  errorMessage?: string;
}
export const RATE_LIMIT_KEY = 'rate-limit';

export const RateLimit = (config: RateLimitConfig) => {
  const defaultConfig = {
    limit: 3,
    duration: 300, // seconds
    ...config, // Override defaults with provided values
  };

  return SetMetadata(RATE_LIMIT_KEY, defaultConfig);
};
