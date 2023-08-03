import {
  Listener,
  Subjects,
  QueueGroups,
  ForgotPasswordEvent,
} from '@mujtaba-web/common';
import { Message, Stan } from 'node-nats-streaming';
import { MailService } from '../../mail.service';

export class ForgotPasswordListener extends Listener<ForgotPasswordEvent> {
  subject: Subjects.PasswordUpdated = Subjects.PasswordUpdated;
  queueGroupName: QueueGroups.MailService = QueueGroups.MailService;

  constructor(client: Stan, private readonly mailService: MailService) {
    super(client);
  }

  async onMessage(data: ForgotPasswordEvent['data'], msg: Message) {
    await this.mailService.updatePassword(data);
    msg.ack();
  }
}
