// import { CustomStrategy } from '@nestjs/microservices';
// import { Listener } from '@nestjs-plugins/nestjs-nats-streaming-transport';
// import { QueueGroups, STAN } from '@dine_ease/common';

// export const StanOptions: CustomStrategy = {
//   strategy: new Listener(
//     'dine-ease',
//     'abc9',
//     QueueGroups.DiningPlanService,
//     {
//       url: 'http://localhost:4222',
//     },
//     {
//       ackWait: STAN.ACK_WAIT,
//       deliverAllAvailable: true,
//       manualAckMode: true,
//       durableName: QueueGroups.DiningPlanService,
//     },
//   ),
// };