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
import { ContentService } from './content.service';

// Dto
import { ContentDto } from './dto/content.dto';

@UseGuards(WebsiteAuthGuard, CreatorRoleGuard)
@Controller('/api/content/:websiteId')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('/:sectionId/create')
  async createContent(
    @GetWebsiteUser() user: WebsiteUserDetails,
    @Param('sectionId') sectionId: Types.ObjectId,
    @Body() contentDto: ContentDto,
  ): Promise<string> {
    return this.contentService.createContent(user, sectionId, contentDto);
  }

  @Patch('/:contentId')
  async updateContentDetails(
    @Param('contentId') contentId: Types.ObjectId,
    @Body() contentDto: ContentDto,
  ): Promise<string> {
    return this.contentService.updateContentDetails(contentId, contentDto);
  }

  @Delete('/:contentId')
  deleteContent(
    @Param('contentId') contentId: Types.ObjectId,
  ): Promise<string> {
    return this.contentService.deleteContent(contentId);
  }
}
