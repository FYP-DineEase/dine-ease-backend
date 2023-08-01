import { NestFactory } from '@nestjs/core';
import { WebsiteModule } from './website.module';
import { ValidationPipe } from '@nestjs/common';
import { AppLoggerService, GlobalExceptionFilter } from '@mujtaba-web/common';

async function bootstrap() {
  const app = await NestFactory.create(WebsiteModule);

  const appLogger = app.get(AppLoggerService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter(appLogger));

  // server start
  const PORT = 3002;
  await app.listen(PORT, () => {
    appLogger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();
