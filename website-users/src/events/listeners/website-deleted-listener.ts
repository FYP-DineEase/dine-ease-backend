import {
  Listener,
  Subjects,
  QueueGroups,
  WebsiteDeletedEvent,
} from '@mujtaba-web/common';
import { Message, Stan } from 'node-nats-streaming';
import { WebsiteService } from 'src/website/website.service';

export class WebsiteDeletedListener extends Listener<WebsiteDeletedEvent> {
  subject: Subjects.WebsiteDeleted = Subjects.WebsiteDeleted;
  queueGroupName: QueueGroups.WebsiteUsersService =
    QueueGroups.WebsiteUsersService;

  constructor(client: Stan, private readonly websiteService: WebsiteService) {
    super(client);
  }

  async onMessage(data: WebsiteDeletedEvent['data'], msg: Message) {
    await this.websiteService.deleteWebsite(data);
    msg.ack();
  }
}
