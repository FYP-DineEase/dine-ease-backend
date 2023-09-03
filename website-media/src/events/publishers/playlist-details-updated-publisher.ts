import {
  Subjects,
  Publisher,
  PlaylistDetailsUpdatedEvent,
} from '@mujtaba-web/common';

export class PlaylistDetailsUpdatedPublisher extends Publisher<PlaylistDetailsUpdatedEvent> {
  subject: Subjects.PlaylistDetailsUpdated = Subjects.PlaylistDetailsUpdated;
}
