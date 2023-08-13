import { Subjects, Publisher, WebsiteDeletedEvent } from '@mujtaba-web/common';

export class WebsiteDeletedPublisher extends Publisher<WebsiteDeletedEvent> {
  subject: Subjects.WebsiteDeleted = Subjects.WebsiteDeleted;
}
