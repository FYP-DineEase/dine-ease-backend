import { Injectable } from '@nestjs/common';
import { connect, Stan } from 'node-nats-streaming';
import { BadRequestException } from '@nestjs/common';
import { NatsLoggerService } from '@mujtaba-web/common';

@Injectable()
export class NatsWrapper {
  private _client?: Stan;

  constructor(private readonly natsLogger: NatsLoggerService) {}

  get client() {
    if (!this._client) {
      throw new BadRequestException(
        'Cannot access Nats client before connecting',
      );
    }
    return this._client;
  }

  connect(cluserId: string, clientId: string, url: string) {
    this._client = connect(cluserId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        this.natsLogger.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        this.natsLogger.error('NATS Connection Error', err);
        reject(err);
      });
    });
  }
}
