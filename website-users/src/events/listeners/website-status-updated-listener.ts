import {
  Listener,
  Subjects,
  QueueGroups,
  WebsiteStatusUpdatedEvent,
} from '@mujtaba-web/common';
import { Message, Stan } from 'node-nats-streaming';
import { WebsiteService } from 'src/website/website.service';

export class WebsiteStatusUpdatedListener extends Listener<WebsiteStatusUpdatedEvent> {
  subject: Subjects.WebsiteStatusUpdated = Subjects.WebsiteStatusUpdated;
  queueGroupName: QueueGroups.WebsiteUsersService =
    QueueGroups.WebsiteUsersService;

  constructor(client: Stan, private readonly websiteService: WebsiteService) {
    super(client);
  }

  async onMessage(data: WebsiteStatusUpdatedEvent['data'], msg: Message) {
    await this.websiteService.updateWebsiteStatus(data);
    msg.ack();
  }
}
