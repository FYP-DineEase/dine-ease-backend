// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    UserModule,
    NotificationModule,
    DatabaseModule,
  ],
})
export class AppModule {}
