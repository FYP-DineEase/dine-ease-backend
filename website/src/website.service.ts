import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Website, WebsiteDocument } from './schemas/website.schema';

// DTO
import { WebsiteNameDto } from './dto/website-name.dto';
import { WebsiteIdDto } from './dto/website-Id.dto';
import { WebsiteStatusDto } from './dto/website-status.dto';

// utils
import {
  WebsiteRemovalStatus,
  WebsiteStatus,
  UserDetails,
} from '@mujtaba-web/common';

// event
import { NatsWrapper } from '@mujtaba-web/common';
import { WebsiteCreatedPublisher } from './events/publishers/website-created-publisher';
import { WebsiteDeletedPublisher } from './events/publishers/website-deleted-publisher';
import { WebsiteNameUpdatedPublisher } from './events/publishers/website-name-updated-publisher';
import { WebsiteStatusUpdatedPublisher } from './events/publishers/website-status-updated-publisher';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(Website.name) private websiteModel: Model<WebsiteDocument>,
    private readonly natsWrapper: NatsWrapper,
  ) {}

  // check website id and user
  async checkWebsiteAndUser(
    userId: string,
    webId: string,
  ): Promise<WebsiteDocument> {
    const website: WebsiteDocument = await this.websiteModel.findById(webId);

    if (!website) throw new NotFoundException('Website not found');

    if (website.status === WebsiteRemovalStatus.OFFLINE)
      throw new BadRequestException('Website is currently InActive');

    if (website.userId !== userId)
      throw new UnauthorizedException('Invalid User');
    return website;
  }

  // check website name
  async checkWebsiteName(website: WebsiteNameDto): Promise<boolean> {
    const foundWebsite: WebsiteDocument = await this.websiteModel.findOne({
      websiteName: website.name,
    });
    if (foundWebsite) return true;
    return false;
  }

  // get all websites
  async getAllWebsites(): Promise<Website[]> {
    const foundWebsites: WebsiteDocument[] = await this.websiteModel.find();
    return foundWebsites;
  }

  // get user websites
  async getAllUserWebsites(user: UserDetails): Promise<Website[]> {
    const foundWebsites: WebsiteDocument[] = await this.websiteModel.find({
      userId: user.id,
    });
    return foundWebsites;
  }

  // create website
  async createWebsite(
    user: UserDetails,
    websiteNameDto: WebsiteNameDto,
  ): Promise<Website> {
    const isExist: boolean = await this.checkWebsiteName(websiteNameDto);
    if (isExist) throw new BadRequestException('Website Already Taken');

    const createdWebsite = new this.websiteModel({
      userId: user.id,
      websiteName: websiteNameDto.name,
      status: WebsiteStatus.ONLINE,
    });
    const savedWebsite = await createdWebsite.save();

    new WebsiteCreatedPublisher(this.natsWrapper.client).publish({
      id: savedWebsite.id,
      userId: savedWebsite.userId,
      websiteName: savedWebsite.websiteName,
      status: savedWebsite.status,
      version: savedWebsite.version,
    });

    return savedWebsite;
  }

  // update website name
  async updateWebsiteName(
    websiteIdDto: WebsiteIdDto,
    user: UserDetails,
    websiteNameDto: WebsiteNameDto,
  ): Promise<string> {
    const foundWebsite: WebsiteDocument = await this.checkWebsiteAndUser(
      user.id,
      websiteIdDto.id,
    );

    if (foundWebsite.websiteName === websiteNameDto.name) {
      throw new ConflictException('Cannot use previous Website Name');
    }

    foundWebsite.set({ websiteName: websiteNameDto.name });
    await foundWebsite.save();

    new WebsiteNameUpdatedPublisher(this.natsWrapper.client).publish({
      id: foundWebsite.id,
      name: foundWebsite.websiteName,
      version: foundWebsite.version,
    });

    return `Website Name Updated Successfully`;
  }

  // update website status
  async updateWebsiteStatus(
    websiteIdDto: WebsiteIdDto,
    user: UserDetails,
    websiteStatusDto: WebsiteStatusDto,
  ): Promise<string> {
    const foundWebsite: WebsiteDocument = await this.checkWebsiteAndUser(
      user.id,
      websiteIdDto.id,
    );

    if (foundWebsite.status === websiteStatusDto.status) {
      throw new ConflictException('Cannot use previous Website Status');
    }

    foundWebsite.set({ status: websiteStatusDto.status });
    await foundWebsite.save();

    new WebsiteStatusUpdatedPublisher(this.natsWrapper.client).publish({
      id: foundWebsite.id,
      status: foundWebsite.status,
      version: foundWebsite.version,
    });

    return `Website Status Updated Successfully`;
  }

  // delete website
  async deleteWebsite(
    websiteIdDto: WebsiteIdDto,
    user: UserDetails,
  ): Promise<string> {
    const foundWebsite: WebsiteDocument = await this.checkWebsiteAndUser(
      user.id,
      websiteIdDto.id,
    );

    foundWebsite.set({ status: WebsiteRemovalStatus.OFFLINE });
    await foundWebsite.save();

    new WebsiteDeletedPublisher(this.natsWrapper.client).publish({
      id: foundWebsite.id,
      version: foundWebsite.version,
    });

    return `Website Deleted Successfully`;
  }
}
