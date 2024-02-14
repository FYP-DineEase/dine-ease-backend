import { CustomStrategy } from '@nestjs/microservices';
import { Listener } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { QueueGroups, STAN } from '@dine_ease/common';

export const StanOptions: CustomStrategy = {
  strategy: new Listener(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    QueueGroups.RestaurantService,
    {
      url: process.env.NATS_URL,
    },
    {
      ackWait: STAN.ACK_WAIT,
      deliverAllAvailable: true,
      manualAckMode: true,
      durableName: QueueGroups.RestaurantService,
    },
  ),
};
