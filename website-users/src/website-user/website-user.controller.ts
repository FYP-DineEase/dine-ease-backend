import { Get, Param, Controller, UseGuards, Patch, Body } from '@nestjs/common';
import {
  AuthGuard,
  GetUser,
  GetWebsiteUser,
  UserDetails,
  WebsiteAuthGuard,
  WebsiteUserDetails,
} from '@mujtaba-web/common';
import { WebsiteUserService } from './website-user.service';
import { WebsiteService } from 'src/website/website.service';
import { WebsiteUserDocument } from './schemas/website-user.schema';
import { NewsletterDto } from './dto/user-newsletter.dto';

@Controller('/api/website-user/:websiteId')
export class WebsiteUserController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly websiteUserService: WebsiteUserService,
  ) {}

  @UseGuards(WebsiteAuthGuard)
  @Get('current')
  userDetails(
    @GetWebsiteUser() websiteUser: WebsiteUserDetails,
  ): WebsiteUserDetails {
    return websiteUser;
  }

  @UseGuards(AuthGuard)
  @Get('auth')
  async auth(
    @GetUser() user: UserDetails,
    @Param('websiteId') websiteId: string,
  ): Promise<string> {
    const foundWebsite = await this.websiteService.findWebsite(websiteId);
    return this.websiteUserService.auth(user, foundWebsite);
  }

  @UseGuards(WebsiteAuthGuard)
  @Get('user-details')
  async user(
    @GetWebsiteUser() websiteUser: WebsiteUserDetails,
  ): Promise<WebsiteUserDocument> {
    return this.websiteUserService.fetchUserDetails(websiteUser);
  }

  @UseGuards(WebsiteAuthGuard)
  @Patch('newsletter')
  async updateNewsletter(
    @GetWebsiteUser() websiteUser: WebsiteUserDetails,
    @Body() data: NewsletterDto,
  ): Promise<WebsiteUserDocument> {
    return this.websiteUserService.updateNewsletter(websiteUser, data);
  }
}
