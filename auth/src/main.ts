import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { natsWrapper } from './nats.service';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  try {
    await natsWrapper.connect('web-craft', 'abc1', 'http://localhost:4222');
  } catch (e) {
    console.log(e);
  }

  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  // server start
  const PORT = 3000;
  await app.listen(PORT);
}
bootstrap();
