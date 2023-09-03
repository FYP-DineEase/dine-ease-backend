import { Injectable, NotFoundException } from '@nestjs/common';
import { WebsiteUserDetails } from '@mujtaba-web/common';
import { PlaylistStatus } from 'src/utils/enums/playlist-status.enum';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';

// DTO
import { PlaylistDto } from './dto/playlist.dto';
import { PlaylistStatusDto } from './dto/playlist-status.dto';

// event
import { NatsWrapper } from '@mujtaba-web/common';
import { PlaylistCreatedPublisher } from '../events/publishers/playlist-created-publisher';
import { PlaylistDetailsUpdatedPublisher } from '../events/publishers/playlist-details-updated-publisher';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly natsWrapper: NatsWrapper,
    @InjectModel(Playlist.name)
    private playlistModel: Model<PlaylistDocument>,
  ) {}

  // verify playlist by id
  async findPlaylistById(id: Types.ObjectId): Promise<PlaylistDocument> {
    const playlist: PlaylistDocument = await this.playlistModel.findById(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  // find playlist by id and poluate it
  async populatedPlaylistById(id: Types.ObjectId): Promise<PlaylistDocument> {
    const playlist = await this.playlistModel
      .findById(id)
      .populate({
        path: 'sections',
        model: 'Section',
        populate: {
          path: 'content',
          model: 'Content',
        },
      })
      .exec();
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  // update playlist section
  async updatePlaylistSection(
    playlistId: Types.ObjectId,
    sectionId: Types.ObjectId,
  ): Promise<PlaylistDocument> {
    const playlist: PlaylistDocument =
      await this.playlistModel.findByIdAndUpdate(playlistId, {
        $pull: { sections: sectionId },
      });
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  // find all playlist ( only showed on admin list )
  async findAllPlaylist(webId: Types.ObjectId): Promise<PlaylistDocument[]> {
    const playlists: PlaylistDocument[] = await this.playlistModel.find({
      websiteId: webId,
      isDeleted: false,
    });
    return playlists;
  }

  // find active playlist ( showed on website )
  async findActivePlaylist(webId: Types.ObjectId): Promise<PlaylistDocument[]> {
    const playlists: PlaylistDocument[] = await this.playlistModel.find({
      websiteId: webId,
      status: PlaylistStatus.ACTIVE,
      isDeleted: false,
    });
    return playlists;
  }

  // create playlist
  async createPlaylist(
    user: WebsiteUserDetails,
    playlistDto: PlaylistDto,
  ): Promise<string> {
    const playlist = new this.playlistModel({
      userId: user.id,
      websiteId: user.websiteId,
      ...playlistDto,
    });
    await playlist.save();

    new PlaylistCreatedPublisher(this.natsWrapper.client).publish({
      playlistId: playlist.id,
      websiteId: user.websiteId,
      title: playlist.title,
      price: playlist.price,
      version: playlist.version,
    });

    return 'Playlist Created Successfully';
  }

  // update playlist
  async updatePlaylistDetails(
    playlistId: Types.ObjectId,
    playlistDto: PlaylistDto,
  ): Promise<string> {
    const playlist = await this.playlistModel.findByIdAndUpdate(
      playlistId,
      playlistDto,
      { new: true },
    );

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    new PlaylistDetailsUpdatedPublisher(this.natsWrapper.client).publish({
      playlistId: playlist.id,
      title: playlist.title,
      price: playlist.price,
      version: playlist.version,
    });

    return `Playlist Updated Successfully`;
  }

  // update playlist
  async updatePlaylistStatus(
    playlistId: Types.ObjectId,
    playlistStatusDto: PlaylistStatusDto,
  ): Promise<string> {
    const playlist: PlaylistDocument =
      await this.playlistModel.findByIdAndUpdate(playlistId, playlistStatusDto);

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return `Playlist Updated Successfully`;
  }

  // delete playlist
  async deletePlaylist(playlistId: Types.ObjectId): Promise<string> {
    const playlist: PlaylistDocument =
      await this.playlistModel.findByIdAndUpdate(playlistId, {
        isDeleted: true,
      });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return `Playlist Deleted Successfully`;
  }
}
