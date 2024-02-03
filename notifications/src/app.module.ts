// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    JwtAuthModule,
    LoggerModule,
    DatabaseModule,
  ],
})
export class AppModule {}
