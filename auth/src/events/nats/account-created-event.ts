import { Subjects } from './subjects';

export interface AccountCreatedEvent {
  subject: Subjects.AccountCreated;
  data: {
    name: string;
    email: string;
  };
}
