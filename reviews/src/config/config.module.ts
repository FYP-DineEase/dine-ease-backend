import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configValidation } from './config-validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: configValidation,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
