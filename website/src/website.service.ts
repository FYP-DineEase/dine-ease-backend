import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
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
import { UserDetails } from '@mujtaba-web/common';
import WebsiteStatus from './utils/enums/website-status.enum';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(Website.name) private websiteModel: Model<WebsiteDocument>,
  ) {}

  // check website id and user
  async checkWebsiteAndUser(
    userId: string,
    webId: string,
  ): Promise<WebsiteDocument> {
    const website: WebsiteDocument = await this.websiteModel.findById(webId);
    if (!website) throw new BadRequestException('Website not found');
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

    // publish event here

    return `Website Status Updated Successfully`;
  }
}
