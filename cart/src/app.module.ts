// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule, DatabaseModule } from '@mujtaba-web/common';
import { NatsModule } from './nats/nats.module';
import { CartModule } from './cart/cart.module';
import { configValidationSchema } from './config-schema';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    NatsModule,
    LoggerModule,
    PlaylistModule,
    CartModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-cart'),
  ],
})
export class AppModule {}
