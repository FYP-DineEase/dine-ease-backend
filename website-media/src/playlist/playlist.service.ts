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

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private playlistModel: Model<PlaylistDocument>,
  ) {}

  // add section
  // async updateSection(webId: WebsiteIdDto): Promise<PlaylistDocument[]> {
  //   const website: PlaylistDocument[] = await this.playlistModel.find({
  //     websiteId: webId,
  //     isDeleted: false,
  //   });
  //   return website;
  // }

  // find all playlist
  async findAllPlaylist(webId: Types.ObjectId): Promise<PlaylistDocument[]> {
    const website: PlaylistDocument[] = await this.playlistModel.find({
      websiteId: webId,
      isDeleted: false,
    });
    return website;
  }

  // find active playlist
  async findActivePlaylist(webId: Types.ObjectId): Promise<PlaylistDocument[]> {
    const website: PlaylistDocument[] = await this.playlistModel.find({
      websiteId: webId,
      status: PlaylistStatus.ACTIVE,
      isDeleted: false,
    });
    return website;
  }

  // create playlist
  async createWebsite(
    user: WebsiteUserDetails,
    playlistDto: PlaylistDto,
  ): Promise<string> {
    const createdWebsite = new this.playlistModel({
      userId: user.id,
      websiteId: user.websiteId,
      ...playlistDto,
    });
    await createdWebsite.save();
    return 'Playlist Created Successfully';
  }

  // update playlist
  async updatePlaylistDetails(
    playlistId: Types.ObjectId,
    playlistDto: PlaylistDto,
  ): Promise<string> {
    const playlist: PlaylistDocument =
      await this.playlistModel.findByIdAndUpdate(playlistId, playlistDto);

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    await playlist.save();
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

    await playlist.save();
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
    await playlist.save();
    return `Playlist Deleted Successfully`;
  }
}
