import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import {
  AppLoggerService,
  TransformInterceptor,
  GlobalExceptionFilter,
} from '@mujtaba-web/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const appLogger = app.get(AppLoggerService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter(appLogger));

  // server start
  const PORT = 3000;
  await app.listen(PORT, () => {
    appLogger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();
