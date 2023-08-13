import {
  Subjects,
  Publisher,
  WebsiteNameUpdatedEvent,
} from '@mujtaba-web/common';

export class WebsiteNameUpdatedPublisher extends Publisher<WebsiteNameUpdatedEvent> {
  subject: Subjects.WebsiteNameUpdated = Subjects.WebsiteNameUpdated;
}
