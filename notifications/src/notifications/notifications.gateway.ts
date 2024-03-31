import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

// Services
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from './notification.service';
import { RedisService } from 'src/redis/redis.service';

// Logger
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly notificationService: NotificationService,
  ) {}

  @WebSocketServer()
  server: Server;

  async afterInit() {
    this.logger.info('Conected to Socket Server');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization;
    if (!token) throw new UnauthorizedException('Token Required');
    const user = await this.jwtService.verifyAsync(token);
    await this.redisService.setValue(user.id, user.id);
    this.logger.info(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers.authorization;
    const user = await this.jwtService.verifyAsync(token);
    await this.redisService.deleteValue(user.id);
    this.logger.info(`Client disconnected: ${client.id}`);
  }
}
