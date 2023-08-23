import {
  Listener,
  Subjects,
  QueueGroups,
  WebsiteCreatedEvent,
} from '@mujtaba-web/common';

import { Message, Stan } from 'node-nats-streaming';
import { WebsiteService } from 'src/website/website.service';

export class WebsiteCreatedListener extends Listener<WebsiteCreatedEvent> {
  subject: Subjects.WebsiteCreated = Subjects.WebsiteCreated;
  queueGroupName: QueueGroups.WebsiteUsersService =
    QueueGroups.WebsiteUsersService;

  constructor(client: Stan, private readonly websiteService: WebsiteService) {
    super(client);
  }

  async onMessage(data: WebsiteCreatedEvent['data'], msg: Message) {
    await this.websiteService.createWebsite(data);
    msg.ack();
  }
}
