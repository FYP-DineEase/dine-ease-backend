import {
  Listener,
  Subjects,
  QueueGroups,
  WebsiteNameUpdatedEvent,
} from '@mujtaba-web/common';
import { Message, Stan } from 'node-nats-streaming';
import { WebsiteService } from 'src/website/website.service';

export class WebsiteNameUpdatedListener extends Listener<WebsiteNameUpdatedEvent> {
  subject: Subjects.WebsiteNameUpdated = Subjects.WebsiteNameUpdated;
  queueGroupName: QueueGroups.WebsiteUserService =
    QueueGroups.WebsiteUserService;

  constructor(client: Stan, private readonly websiteService: WebsiteService) {
    super(client);
  }

  async onMessage(data: WebsiteNameUpdatedEvent['data'], msg: Message) {
    await this.websiteService.updateWebsiteName(data);
    msg.ack();
  }
}
