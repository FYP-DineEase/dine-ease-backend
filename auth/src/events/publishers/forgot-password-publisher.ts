import { Subjects, Publisher, ForgotPasswordEvent } from '@mujtaba-web/common';

export class ForgotPasswordPublisher extends Publisher<ForgotPasswordEvent> {
  subject: Subjects.PasswordUpdated = Subjects.PasswordUpdated;
}
