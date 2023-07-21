import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { AppLoggerService } from '@mujtaba-web/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const appLogger = app.get(AppLoggerService);

  // server start
  const PORT = 3000;
  await app.listen(PORT, () => {
    appLogger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();
