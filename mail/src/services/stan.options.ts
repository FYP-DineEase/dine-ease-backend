import { CustomStrategy } from '@nestjs/microservices';
import { Listener } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { QueueGroups } from '@dine_ease/common';

export const StanOptions: CustomStrategy = {
  strategy: new Listener(
    'dine-ease',
    'abc3',
    QueueGroups.UserService,
    {
      url: 'http://localhost:4222',
    },
    {
      ackWait: 5 * 1000,
      deliverAllAvailable: true,
      manualAckMode: true,
      durableName: QueueGroups.MailService,
    },
  ),
};
