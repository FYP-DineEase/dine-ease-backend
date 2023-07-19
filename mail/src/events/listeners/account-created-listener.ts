import { Subjects, Listener, AccountCreatedEvent } from '@mujtaba-web/common';
import { Message, Stan } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { MailService } from '../../mail.service';

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
  subject: Subjects.AccountCreated = Subjects.AccountCreated;
  queueGroupName = queueGroupName;

  constructor(client: Stan, private readonly mailService: MailService) {
    super(client);
  }

  async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
    const { name, email } = data;

    // Send an email using the MailService
    await this.mailService.accountCreation(name, email);

    // Acknowledge the message
    msg.ack();
  }
}
