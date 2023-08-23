import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NatsWrapper, NatsLoggerService } from '@mujtaba-web/common';
import { WebsiteService } from 'src/website/website.service';

import { WebsiteCreatedListener } from 'src/events/listeners/website-created-listener';
import { WebsiteDeletedListener } from 'src/events/listeners/website-deleted-listener';
import { WebsiteNameUpdatedListener } from 'src/events/listeners/website-name-updated-listener';
import { WebsiteStatusUpdatedListener } from 'src/events/listeners/website-status-updated-listener';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly natsLogger: NatsLoggerService,
    private readonly natsWrapper: NatsWrapper,
    private readonly websiteService: WebsiteService,
  ) {}

  async onModuleInit() {
    await this.natsWrapper.connect(
      'web-craft',
      'abc5',
      'http://localhost:4222',
    );

    this.natsWrapper.client.on('close', () => {
      this.natsLogger.warn('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => this.natsWrapper.client.close());
    process.on('SIGTERM', () => this.natsWrapper.client.close());

    this.registerListeners();
  }

  private registerListeners() {
    new WebsiteCreatedListener(
      this.natsWrapper.client,
      this.websiteService,
    ).listen();

    new WebsiteNameUpdatedListener(
      this.natsWrapper.client,
      this.websiteService,
    ).listen();

    new WebsiteDeletedListener(
      this.natsWrapper.client,
      this.websiteService,
    ).listen();

    new WebsiteStatusUpdatedListener(
      this.natsWrapper.client,
      this.websiteService,
    ).listen();
  }

  onModuleDestroy() {
    this.natsWrapper.client.close();
  }
}
