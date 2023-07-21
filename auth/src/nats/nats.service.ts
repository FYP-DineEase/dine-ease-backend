import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NatsLoggerService } from '@mujtaba-web/common';
import { NatsWrapper } from './nats.wrapper';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly natsLogger: NatsLoggerService,
    private readonly natsWrapper: NatsWrapper,
  ) {}

  async onModuleInit() {
    await this.natsWrapper.connect(
      'web-craft',
      'abc1',
      'http://localhost:4222',
    );

    this.natsWrapper.client.on('close', () => {
      this.natsLogger.warn('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => this.natsWrapper.client.close());
    process.on('SIGTERM', () => this.natsWrapper.client.close());
  }

  onModuleDestroy() {
    this.natsWrapper.client.close();
  }
}
