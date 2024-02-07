// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '../redis/redis.module';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notifications.gateway';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './models/notification.entity';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  exports: [NotificationService],
  providers: [RedisService, NotificationService, NotificationGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}
