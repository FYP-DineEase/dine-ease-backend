// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule, DatabaseModule } from '@mujtaba-web/common';

import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { Website, WebsiteSchema } from './schemas/website.schema';
import { configValidationSchema } from './config-schema';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    JwtAuthModule,
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-website'),
    MongooseModule.forFeature([{ name: Website.name, schema: WebsiteSchema }]),
  ],
  providers: [WebsiteService],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
