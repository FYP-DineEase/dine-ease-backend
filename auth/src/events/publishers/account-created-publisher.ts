import { Subjects, Publisher, AccountCreatedEvent } from '@mujtaba-web/common';

export class AccountCreatedPublisher extends Publisher<AccountCreatedEvent> {
  subject: Subjects.AccountCreated = Subjects.AccountCreated;
}
