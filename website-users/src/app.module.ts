// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule, DatabaseModule } from '@mujtaba-web/common';

import { configValidationSchema } from './config-schema';
import { WebsiteUserModule } from './website-user/website-user.module';
import { WebsiteModule } from './website/website.module';
import { NatsModule } from './nats/nats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    NatsModule,
    LoggerModule,
    WebsiteModule,
    WebsiteUserModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-website-users'),
  ],
})
export class AppModule {}
