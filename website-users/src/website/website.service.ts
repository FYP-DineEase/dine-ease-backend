import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Website, WebsiteDocument } from './schemas/website.schema';

import {
  WebsiteCreatedEvent,
  WebsiteDeletedEvent,
  WebsiteNameUpdatedEvent,
  WebsiteRemovalStatus,
  WebsiteStatusUpdatedEvent,
} from '@mujtaba-web/common';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(Website.name)
    private websiteModel: Model<WebsiteDocument>,
  ) {}

  // find website
  async findWebsite(webId: string): Promise<WebsiteDocument> {
    const website: WebsiteDocument = await this.websiteModel.findOne({
      websiteId: webId,
    });
    if (!website) throw new NotFoundException('Website not found');
    return website;
  }

  // find by version
  async findWebsitebyVersion(
    id: string,
    version: number,
  ): Promise<WebsiteDocument> {
    const website: WebsiteDocument = await this.websiteModel.findOne({
      websiteId: id,
      version: version - 1,
    });
    if (!website) throw new NotFoundException('Website not found');
    return website;
  }

  // validate creator of website
  async validateWebsiteCreator(
    webId: string,
    userId: string,
  ): Promise<boolean> {
    const website = await this.findWebsite(webId);
    if (website.userId.toString() === userId) {
      return true;
    }
    throw new UnauthorizedException('Invalid Website User');
  }

  // create website
  async createWebsite(data: WebsiteCreatedEvent['data']): Promise<string> {
    const createdWebsite = new this.websiteModel({
      websiteId: data.id,
      websiteName: data.websiteName,
      userId: data.userId,
      status: data.status,
      version: data.version,
    });
    await createdWebsite.save();
    return 'Website Created Successfully';
  }

  // update website name
  async updateWebsiteName(
    data: WebsiteNameUpdatedEvent['data'],
  ): Promise<string> {
    const website = await this.findWebsitebyVersion(data.id, data.version);
    website.set({ websiteName: data.name });
    await website.save();
    return `Website Name Updated Successfully`;
  }

  // update website status
  async updateWebsiteStatus(
    data: WebsiteStatusUpdatedEvent['data'],
  ): Promise<string> {
    const website = await this.findWebsitebyVersion(data.id, data.version);
    website.set({ status: data.status });
    await website.save();
    return `Website Status Updated Successfully`;
  }

  // delete website
  async deleteWebsite(data: WebsiteDeletedEvent['data']): Promise<string> {
    const website = await this.findWebsitebyVersion(data.id, data.version);
    if (!website) throw new NotFoundException('Website not found');
    website.set({
      status: WebsiteRemovalStatus.OFFLINE,
    });
    await website.save();
    return `Website Deleted Successfully`;
  }
}
