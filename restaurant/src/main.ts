import { NestFactory } from '@nestjs/core';
import { RestaurantModule } from './restaurant.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@dine_ease/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // const microService = app.connectMicroservice(StanOptions);
  // microService.listen();

  // enable cors
  app.enableCors({
    allowedHeaders: ['*'],
    origin: 'http://localhost:3000',
  });

  // server start
  const PORT = 3006;
  await app.listen(PORT, () => {
    logger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();
