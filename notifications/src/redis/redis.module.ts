import { Module } from '@nestjs/common';
import { createClient } from 'redis';

// Logger
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (logger: Logger) => {
        const client = createClient({
          url: process.env.REDIS_HOST,
        });

        client.connect();

        client.on('connect', () => {
          logger.info('Connected to Redis');
        });

        client.on('error', (err: any) => {
          logger.error('Redis Connection Error', err);
        });

        return client;
      },
      inject: [WINSTON_MODULE_PROVIDER],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
