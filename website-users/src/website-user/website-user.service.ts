import { Injectable } from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  WebsiteUser,
  WebsiteUserDocument,
} from './schemas/website-user.schema';

@Injectable()
export class WebsiteUserService {
  constructor(
    @InjectModel(WebsiteUser.name)
    private websiteUser: Model<WebsiteUserDocument>,
  ) {}
}
