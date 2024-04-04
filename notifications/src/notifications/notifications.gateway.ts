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
import { RedisService } from 'src/redis/redis.service';
import { SocketService } from 'src/services/socket.service';

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
    private readonly socketService: SocketService,
  ) {}

  @WebSocketServer()
  server: Server;

  async afterInit(server: Server) {
    this.socketService.socket = server;
    this.logger.info('Conected to Socket Server');
  }

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    if (!token) throw new UnauthorizedException('Token Required');
    const user = await this.jwtService.verifyAsync(token);
    await this.redisService.setValue(String(user.id), socket.id);
    this.logger.info(`Client connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    const user = await this.jwtService.verifyAsync(token);
    await this.redisService.deleteValue(String(user.id));
    this.logger.info(`Client disconnected: ${socket.id}`);
  }
}
