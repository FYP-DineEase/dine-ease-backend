import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const configService = app.get<ConfigService>(ConfigService);

  // server start
  const PORT = configService.get('SERVER_PORT');
  await app.listen(PORT, () => {
    logger.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
