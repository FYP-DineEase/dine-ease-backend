import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@dine_ease/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { StanOptions } from './services/stan.options';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  const microService = app.connectMicroservice(StanOptions);
  microService.listen();

  const parserLimit = '20mb';
  app.useBodyParser('json', { limit: parserLimit });
  app.useBodyParser('urlencoded', { limit: parserLimit, extended: true });

  app.set('trust proxy', 1);

  // server start
  const PORT = 3000;
  await app.listen(PORT, () => {
    logger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();
