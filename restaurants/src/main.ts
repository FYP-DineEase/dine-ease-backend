import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionFilter } from '@dine_ease/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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

  // enable cors
  app.enableCors({
    allowedHeaders: ['*'],
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  });

  // server start
  const PORT = 3007;
  await app.listen(PORT, () => {
    logger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();
