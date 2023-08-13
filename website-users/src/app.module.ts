// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule, DatabaseModule, NatsWrapper } from '@mujtaba-web/common';

import { configValidationSchema } from './config-schema';
import { NatsService } from './nats/nats.service';
import { WebsiteUserModule } from './website-user/website-user.module';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    LoggerModule,
    WebsiteModule,
    WebsiteUserModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-website-users'),
  ],
  providers: [NatsService, NatsWrapper],
})
export class AppModule {}
