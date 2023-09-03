import {
  Listener,
  Subjects,
  QueueGroups,
  PlaylistCreatedEvent,
} from '@mujtaba-web/common';
import { Message, Stan } from 'node-nats-streaming';
import { PlaylistService } from 'src/playlist/playlist.service';

export class PlaylistCreatedListener extends Listener<PlaylistCreatedEvent> {
  subject: Subjects.PlaylistCreated = Subjects.PlaylistCreated;
  queueGroupName: QueueGroups.CartService = QueueGroups.CartService;

  constructor(client: Stan, private readonly playlistService: PlaylistService) {
    super(client);
  }

  async onMessage(data: PlaylistCreatedEvent['data'], msg: Message) {
    await this.playlistService.createPlaylist(data);
    msg.ack();
  }
}
