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
  WebsiteUserDetails,
} from '@mujtaba-web/common';
import { CreatorRoleGuard } from 'src/guards/creator-role.guard';

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

  @Get('/all')
  allWebistePlaylist(
    @Param('websiteId') webId: Types.ObjectId,
  ): Promise<PlaylistDocument[]> {
    return this.playlistService.findAllPlaylist(webId);
  }

  @Get('/active')
  activeWebistePlaylist(
    @Param('websiteId') webId: Types.ObjectId,
  ): Promise<PlaylistDocument[]> {
    return this.playlistService.findActivePlaylist(webId);
  }

  // website creator guard ( userole === creator and website id match)
  @UseGuards(WebsiteAuthGuard, CreatorRoleGuard)
  @Post('/create')
  createPlaylist(
    @GetWebsiteUser() websiteUser: WebsiteUserDetails,
    @Body() playlistDto: PlaylistDto,
  ): Promise<string> {
    return this.playlistService.createWebsite(websiteUser, playlistDto);
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

  @Delete('/:playlistId')
  deletePlaylist(
    @Param('playlistId') playlistId: Types.ObjectId,
  ): Promise<string> {
    return this.playlistService.deletePlaylist(playlistId);
  }
}
