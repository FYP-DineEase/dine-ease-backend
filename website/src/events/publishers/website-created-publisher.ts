import { Subjects, Publisher, WebsiteCreatedEvent } from '@mujtaba-web/common';

export class WebsiteCreatedPublisher extends Publisher<WebsiteCreatedEvent> {
  subject: Subjects.WebsiteCreated = Subjects.WebsiteCreated;
}
