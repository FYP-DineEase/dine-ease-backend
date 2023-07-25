import {
  Listener,
  AccountCreatedEvent,
  Subjects,
  QueueGroups,
} from '@mujtaba-web/common';
import { Message, Stan } from 'node-nats-streaming';
import { MailService } from '../../mail.service';

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
  subject: Subjects.AccountCreated = Subjects.AccountCreated;
  queueGroupName: QueueGroups.MailService = QueueGroups.MailService;

  constructor(client: Stan, private readonly mailService: MailService) {
    super(client);
  }

  async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
    await this.mailService.sendUserConfirmation(data);
    msg.ack();
  }
}
