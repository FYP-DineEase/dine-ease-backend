import {
  Controller,
  Param,
  Query,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WebsiteService } from './website.service';
import { Website } from './schemas/website.schema';

// Misc
import { UserDetails, GetUser, AuthGuard } from '@mujtaba-web/common';

// DTO
import { WebsiteNameDto } from './dto/website-name.dto';
import { WebsiteIdDto } from './dto/website-Id.dto';
import { WebsiteStatusDto } from './dto/website-status.dto';

@Controller('/api/website')
@UseGuards(AuthGuard)
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get('all')
  getAllWebsites(): Promise<Website[]> {
    return this.websiteService.getAllWebsites();
  }

  @Get('check')
  async checkWebsiteName(
    @Query() name: WebsiteNameDto,
  ): Promise<{ isExist: boolean }> {
    const isExist = await this.websiteService.checkWebsiteName(name);
    return { isExist };
  }

  @Get('/user-websites')
  getAllUserWebsites(@GetUser() user: UserDetails): Promise<Website[]> {
    return this.websiteService.getAllUserWebsites(user);
  }

  @Post('create')
  createWebsite(
    @GetUser() user: UserDetails,
    @Body() website: WebsiteNameDto,
  ): Promise<Website> {
    return this.websiteService.createWebsite(user, website);
  }

  @Patch('/:id/name')
  updateWebsiteName(
    @Param() websiteId: WebsiteIdDto,
    @GetUser() user: UserDetails,
    @Body() website: WebsiteNameDto,
  ): Promise<string> {
    return this.websiteService.updateWebsiteName(websiteId, user, website);
  }

  @Patch('/:id/status')
  updateWebsiteStatus(
    @GetUser() user: UserDetails,
    @Param() websiteId: WebsiteIdDto,
    @Body() websiteStatus: WebsiteStatusDto,
  ): Promise<string> {
    return this.websiteService.updateWebsiteStatus(
      websiteId,
      user,
      websiteStatus,
    );
  }

  @Delete('/:id')
  deleteWebsite(
    @GetUser() user: UserDetails,
    @Param() websiteId: WebsiteIdDto,
  ): Promise<string> {
    return this.websiteService.deleteWebsite(websiteId, user);
  }
}
