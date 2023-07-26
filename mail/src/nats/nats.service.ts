import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NatsWrapper, NatsLoggerService } from '@mujtaba-web/common';
import { AccountCreatedListener } from 'src/events/listeners/account-created-listener';
import { MailService } from '../mail.service';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly natsLogger: NatsLoggerService,
    private readonly natsWrapper: NatsWrapper,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    await this.natsWrapper.connect(
      'web-craft',
      'abc2',
      'http://localhost:4222',
    );

    this.natsWrapper.client.on('close', () => {
      this.natsLogger.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => this.natsWrapper.client.close());
    process.on('SIGTERM', () => this.natsWrapper.client.close());

    this.registerListeners();
  }

  private registerListeners() {
    const accountCreatedListener = new AccountCreatedListener(
      this.natsWrapper.client,
      this.mailService,
    );
    accountCreatedListener.listen();
  }

  onModuleDestroy() {
    this.natsWrapper.client.close();
  }
}
