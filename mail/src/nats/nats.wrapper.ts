import { Injectable } from '@nestjs/common/decorators';
import { connect, Stan } from 'node-nats-streaming';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class NatsWrapper {
  private _client?: Stan;

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
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        console.log('NATS Connection Error');
        reject(err);
      });
    });
  }
}
