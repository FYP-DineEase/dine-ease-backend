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
import { SectionService } from './section.service';
import { SectionDocument } from './schemas/section.schema';

// Dto
import { SectionDto } from './dto/Section.dto';

@UseGuards(WebsiteAuthGuard, CreatorRoleGuard)
@Controller('/api/section/:websiteId')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  // REMOVE
  @Get('/:playlistId/all')
  async allWebisteSection(
    @Param('playlistId') playlistId: Types.ObjectId,
  ): Promise<SectionDocument[]> {
    return this.sectionService.findAllSection(playlistId);
  }

  @Post('/:playlistId/create')
  async createSection(
    @GetWebsiteUser() user: WebsiteUserDetails,
    @Param('playlistId') playlistId: Types.ObjectId,
    @Body() sectionDto: SectionDto,
  ): Promise<string> {
    return this.sectionService.createSection(user, playlistId, sectionDto);
  }

  @Patch('/:sectionId')
  async updateSectionDetails(
    @Param('sectionId') sectionId: Types.ObjectId,
    @Body() SectionDto: SectionDto,
  ): Promise<string> {
    return this.sectionService.updateSectionDetails(sectionId, SectionDto);
  }

  @Delete('/:sectionId')
  deleteSection(
    @Param('sectionId') sectionId: Types.ObjectId,
  ): Promise<string> {
    return this.sectionService.deleteSection(sectionId);
  }
}
