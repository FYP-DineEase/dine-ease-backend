import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@dine_ease/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { StanOptions } from './services/stan.options';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  const microService = app.connectMicroservice(StanOptions);
  microService.listen();

  app.set('trust proxy', 1);

  // enable cors
  app.enableCors({
    allowedHeaders: ['*'],
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  });

  // server start
  const PORT = 3002;
  await app.listen(PORT, () => {
    logger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();
