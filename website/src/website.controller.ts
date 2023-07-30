import {
  Controller,
  Param,
  Query,
  Body,
  Get,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WebsiteService } from './website.service';
import { Website } from './schemas/website.schema';

// Misc
import { UserDetails, GetUser, AuthGuard } from '@mujtaba-web/common';

// DTO
import { CreateWebsiteDto } from './dto/create-website.dto';
import { WebsiteIdDto } from './dto/website-Id.dto';

@Controller('/api/website')
@UseGuards(AuthGuard)
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get('all')
  getAllWebsites(): Promise<Website[]> {
    return this.websiteService.getAllWebsites();
  }

  @Get('check')
  checkWebsiteName(@Body() website: WebsiteIdDto): Promise<boolean> {
    return this.websiteService.checkWebsiteName(website);
  }

  @Get('/:id')
  getAllUserWebsites(@GetUser() user: UserDetails): Promise<Website[]> {
    return this.websiteService.getAllUserWebsites(user);
  }

  @Get('create')
  createWebsite(
    @GetUser() user: UserDetails,
    @Body() website: CreateWebsiteDto,
  ): Promise<Website> {
    return this.websiteService.createWebsite(user, website);
  }

  @Patch('/:id/name')
  updateWebsite(
    @Param('id') id: string,
    @GetUser() user: UserDetails,
    @Body() website: CreateWebsiteDto,
  ): Promise<string> {
    return this.websiteService.updateWebsite(id, user, website);
  }

  @Delete('delete')
  deleteUnverified(
    @GetUser() user: UserDetails,
    @Query() websiteId: WebsiteIdDto,
  ): Promise<string> {
    return this.websiteService.deleteWebsite(user, websiteId);
  }
}
