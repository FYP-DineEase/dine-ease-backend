// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './models/notification.entity';
import { NotificationGateway } from './notifications.gateway';
import { RedisModule } from 'src/redis/redis.module';

// Services
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
  providers: [RedisService, NotificationService, NotificationGateway],
})
export class NotificationModule {}
