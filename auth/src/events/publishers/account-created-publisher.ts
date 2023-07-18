import { Subjects } from '../nats/subjects';
import { Publisher } from '../nats/base-publisher';
import { AccountCreatedEvent } from '../nats/account-created-event';

export class AccountCreatedPublisher extends Publisher<AccountCreatedEvent> {
  subject: Subjects.AccountCreated = Subjects.AccountCreated;
}
