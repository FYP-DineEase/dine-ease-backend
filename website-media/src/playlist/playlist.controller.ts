import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Controller,
  UseGuards,
} from '@nestjs/common';
import {
  GetWebsiteUser,
  WebsiteAuthGuard,
  CreatorRoleGuard,
  WebsiteUserDetails,
} from '@mujtaba-web/common';

// Database
import { Types } from 'mongoose';
import { PlaylistService } from 'src/playlist/playlist.service';
import { PlaylistDocument } from './schemas/playlist.schema';

// Dto
import { PlaylistDto } from './dto/playlist.dto';
import { PlaylistStatusDto } from './dto/playlist-status.dto';

@Controller('/api/playlist/:websiteId')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('/active')
  activeWebistePlaylist(
    @Param('websiteId') webId: Types.ObjectId,
  ): Promise<PlaylistDocument[]> {
    return this.playlistService.findActivePlaylist(webId);
  }

  @UseGuards(WebsiteAuthGuard, CreatorRoleGuard)
  @Get('/all')
  allWebistePlaylist(
    @Param('websiteId') webId: Types.ObjectId,
  ): Promise<PlaylistDocument[]> {
    return this.playlistService.findAllPlaylist(webId);
  }

  @UseGuards(WebsiteAuthGuard)
  @Get('/details/:playlistId')
  populatedWebistePlaylist(
    @Param('playlistId') playlistId: Types.ObjectId,
  ): Promise<PlaylistDocument> {
    return this.playlistService.populatedPlaylistById(playlistId);
  }

  @UseGuards(WebsiteAuthGuard, CreatorRoleGuard)
  @Post('/create')
  createPlaylist(
    @GetWebsiteUser() websiteUser: WebsiteUserDetails,
    @Body() playlistDto: PlaylistDto,
  ): Promise<string> {
    return this.playlistService.createPlaylist(websiteUser, playlistDto);
  }

  @UseGuards(WebsiteAuthGuard, CreatorRoleGuard)
  @Patch('/details/:playlistId')
  updatePlaylist(
    @Param('playlistId') playlistId: Types.ObjectId,
    @Body() playlistDto: PlaylistDto,
  ): Promise<string> {
    return this.playlistService.updatePlaylistDetails(playlistId, playlistDto);
  }

  @UseGuards(WebsiteAuthGuard, CreatorRoleGuard)
  @Patch('/status/:playlistId')
  updatePlaylistStatus(
    @Param('playlistId') playlistId: Types.ObjectId,
    @Body() playlistStatusDto: PlaylistStatusDto,
  ): Promise<string> {
    return this.playlistService.updatePlaylistStatus(
      playlistId,
      playlistStatusDto,
    );
  }

  @UseGuards(WebsiteAuthGuard, CreatorRoleGuard)
  @Delete('/:playlistId')
  deletePlaylist(
    @Param('playlistId') playlistId: Types.ObjectId,
  ): Promise<string> {
    return this.playlistService.deletePlaylist(playlistId);
  }
}
