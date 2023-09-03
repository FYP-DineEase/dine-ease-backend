import { Subjects, Publisher, PlaylistCreatedEvent } from '@mujtaba-web/common';

export class PlaylistCreatedPublisher extends Publisher<PlaylistCreatedEvent> {
  subject: Subjects.PlaylistCreated = Subjects.PlaylistCreated;
}
