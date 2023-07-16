import { Module } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
const { combine, simple, timestamp, ms } = format;

const formatting = combine(
  simple(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ms(),
  utilities.format.nestLike('MyApp', {
    prettyPrint: true,
  }),
);

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'info',
      format: formatting,
      transports: [
        new transports.Console(),
        new transports.File({ filename: './logs/app.log' }),
        new transports.File({
          filename: './logs/errorlog.log',
          level: 'error',
        }),
        new transports.File({
          filename: './logs/warnlog.log',
          level: 'warn',
        }),
      ],
      exceptionHandlers: [
        new transports.File({ filename: './logs/exceptions.log' }),
      ],
      rejectionHandlers: [
        new transports.File({ filename: './logs/rejections.log' }),
      ],
    }),
  ],
})
export class LoggerModule {}
