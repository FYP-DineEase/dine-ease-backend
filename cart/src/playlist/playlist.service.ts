import { Injectable, NotFoundException } from '@nestjs/common';

import {
  PlaylistCreatedEvent,
  PlaylistDetailsUpdatedEvent,
} from '@mujtaba-web/common';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private playlistModel: Model<PlaylistDocument>,
  ) {}

  // find playlist
  async findPlaylist(
    playlistId: Types.ObjectId,
    websiteId: Types.ObjectId,
  ): Promise<PlaylistDocument> {
    const playlist: PlaylistDocument = await this.playlistModel.findOne({
      playlistId,
      websiteId,
    });
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  // create playlist
  async createPlaylist(data: PlaylistCreatedEvent['data']): Promise<string> {
    const playlist = new this.playlistModel(data);
    await playlist.save();
    return 'Playlist Created Successfully';
  }

  // update playlist
  async updatePlaylistDetails(
    data: PlaylistDetailsUpdatedEvent['data'],
  ): Promise<string> {
    const { playlistId, ...details } = data;

    const playlist: PlaylistDocument =
      await this.playlistModel.findOneAndUpdate({ playlistId }, details);

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    return `Playlist Updated Successfully`;
  }
}
