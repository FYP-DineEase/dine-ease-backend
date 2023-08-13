import { Controller, UseGuards } from '@nestjs/common';
import { WebsiteUserService } from './website-user.service';

// Misc
import { AuthGuard } from '@mujtaba-web/common';

@Controller('/api/')
@UseGuards(AuthGuard)
export class WebsiteUserController {
  constructor(private readonly websiteUserService: WebsiteUserService) {}
}
