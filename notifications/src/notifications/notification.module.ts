// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './models/notification.entity';
import { RedisModule } from 'src/redis/redis.module';

// Services
import { RedisService } from 'src/redis/redis.service';
import { SocketService } from 'src/services/socket.service';
import { NotificationGateway } from './notifications.gateway';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
  providers: [
    RedisService,
    SocketService,
    NotificationService,
    NotificationGateway,
  ],
})
export class NotificationModule {}
