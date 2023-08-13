import { Injectable, NotFoundException } from '@nestjs/common';

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

  // create website
  async createWebsite(data: WebsiteCreatedEvent['data']): Promise<string> {
    const createdWebsite = new this.websiteModel({
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
    const website: WebsiteDocument = await this.websiteModel.findById(data.id);

    if (!website) throw new NotFoundException('Website not found');

    website.set({ websiteName: data.name, version: data.version });
    await website.save();
    return `Website Name Updated Successfully`;
  }

  // update website status
  async updateWebsiteStatus(
    data: WebsiteStatusUpdatedEvent['data'],
  ): Promise<string> {
    const website: WebsiteDocument = await this.websiteModel.findById(data.id);

    if (!website) throw new NotFoundException('Website not found');

    website.set({ status: data.status, version: data.version });
    await website.save();
    return `Website Status Updated Successfully`;
  }

  // delete website
  async deleteWebsite(data: WebsiteDeletedEvent['data']): Promise<string> {
    const website: WebsiteDocument = await this.websiteModel.findById(data.id);

    if (!website) throw new NotFoundException('Website not found');

    website.set({
      status: WebsiteRemovalStatus.OFFLINE,
      version: data.version,
    });
    await website.save();

    return `Website Deleted Successfully`;
  }
}
