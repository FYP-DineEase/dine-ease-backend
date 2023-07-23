import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { MailModule } from './mail.module';
import { AppLoggerService } from '@mujtaba-web/common';

async function bootstrap() {
  const app = await NestFactory.create(MailModule);

  const appLogger = app.get(AppLoggerService);
  app.useGlobalPipes(new ValidationPipe());

  // server start
  const PORT = 3001;
  await app.listen(PORT, () => {
    appLogger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();
