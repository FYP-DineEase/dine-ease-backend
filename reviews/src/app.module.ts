// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { ReviewModule } from './review/review.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    JwtAuthModule,
    LoggerModule,
    ReviewModule,
    VoteModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-review'),
  ],
})
export class AppModule {}
