import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configValidation } from './config-validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          JWT_KEY: process.env.JWT_KEY,
        }),
      ],
      validate: configValidation,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
