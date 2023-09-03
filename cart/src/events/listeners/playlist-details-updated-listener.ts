import {
  Listener,
  Subjects,
  QueueGroups,
  PlaylistDetailsUpdatedEvent,
} from '@mujtaba-web/common';
import { Message, Stan } from 'node-nats-streaming';
import { PlaylistService } from 'src/playlist/playlist.service';

export class PlaylistDetailsUpdatedListener extends Listener<PlaylistDetailsUpdatedEvent> {
  subject: Subjects.PlaylistDetailsUpdated = Subjects.PlaylistDetailsUpdated;
  queueGroupName: QueueGroups.CartService = QueueGroups.CartService;

  constructor(client: Stan, private readonly playlistService: PlaylistService) {
    super(client);
  }

  async onMessage(data: PlaylistDetailsUpdatedEvent['data'], msg: Message) {
    await this.playlistService.updatePlaylistDetails(data);
    msg.ack();
  }
}
