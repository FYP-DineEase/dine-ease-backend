import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NatsWrapper, NatsLoggerService } from '@mujtaba-web/common';
import { PlaylistService } from 'src/playlist/playlist.service';

import { PlaylistCreatedListener } from 'src/events/listeners/playlist-created-listener';
import { PlaylistDetailsUpdatedListener } from 'src/events/listeners/playlist-details-updated-listener';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly natsLogger: NatsLoggerService,
    private readonly natsWrapper: NatsWrapper,
    private readonly playlistService: PlaylistService,
  ) {}

  async onModuleInit() {
    await this.natsWrapper.connect(
      'web-craft',
      'abc7',
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
    new PlaylistCreatedListener(
      this.natsWrapper.client,
      this.playlistService,
    ).listen();

    new PlaylistDetailsUpdatedListener(
      this.natsWrapper.client,
      this.playlistService,
    ).listen();
  }

  onModuleDestroy() {
    this.natsWrapper.client.close();
  }
}
