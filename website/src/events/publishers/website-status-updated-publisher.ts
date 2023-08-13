import {
  Subjects,
  Publisher,
  WebsiteStatusUpdatedEvent,
} from '@mujtaba-web/common';

export class WebsiteStatusUpdatedPublisher extends Publisher<WebsiteStatusUpdatedEvent> {
  subject: Subjects.WebsiteStatusUpdated = Subjects.WebsiteStatusUpdated;
}
