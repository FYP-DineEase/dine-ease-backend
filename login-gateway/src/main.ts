import { NestFactory } from '@nestjs/core';
import { LoginModule } from './login.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@dine_ease/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(LoginModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // enable cors
  app.enableCors({
    allowedHeaders: ['*'],
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  });

  // server start
  const PORT = 3000;
  await app.listen(PORT, () => {
    logger.log(`Listening to PORT: ${PORT}`);
  });
}
bootstrap();