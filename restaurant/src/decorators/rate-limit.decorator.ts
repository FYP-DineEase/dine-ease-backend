import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rate-limit';
export const RateLimit = (config: {
  keyPrefix: string;
  limit?: number;
  duration?: number;
  errorMessage?: string;
}) => {
  const defaultConfig = {
    limit: 3,
    duration: 300, // seconds
    ...config, // Override defaults with provided values
  };

  return SetMetadata(RATE_LIMIT_KEY, defaultConfig);
};
