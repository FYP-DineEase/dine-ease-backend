// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule, DatabaseModule } from '@mujtaba-web/common';
import { PlaylistModule } from './playlist/playlist.module';

import { configValidationSchema } from './config-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    LoggerModule,
    PlaylistModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-website-media'),
  ],
})
export class AppModule {}
