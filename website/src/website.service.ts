import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Website } from './schemas/website.schema';

// DTO
import { CreateWebsiteDto } from './dto/create-website.dto';
import { WebsiteIdDto } from './dto/website-Id.dto';

// utils
import { UserDetails } from '@mujtaba-web/common';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(Website.name) private websiteModel: Model<Website>,
  ) {}

  // check website name
  async checkWebsiteName(websiteId: WebsiteIdDto): Promise<boolean> {
    const foundWebsite: Website = await this.websiteModel.findById(websiteId);
    if (foundWebsite) return true;
    return false;
  }

  // get all websites
  async getAllWebsites(): Promise<Website[]> {
    const foundWebsites: Website[] = await this.websiteModel.find();
    return foundWebsites;
  }

  // get user websites
  async getAllUserWebsites(user: UserDetails): Promise<Website[]> {
    const foundWebsites: Website[] = await this.websiteModel.find({
      userId: user.id,
    });
    return foundWebsites;
  }

  // get user websites
  async createWebsite(
    user: UserDetails,
    website: CreateWebsiteDto,
  ): Promise<Website> {
    const createdWebsite = new this.websiteModel({
      userId: user.id,
      websiteName: website.name,
    });
    const savedWebsite = await createdWebsite.save();
    return savedWebsite;
  }

  // update website
  async updateWebsite(
    websiteId: string,
    user: UserDetails,
    website: CreateWebsiteDto,
  ): Promise<string> {
    const foundWebsite = await this.websiteModel.findById(websiteId);
    if (!foundWebsite) throw new BadRequestException('User not found');

    if (foundWebsite.userId === user.id)
      throw new UnauthorizedException('Invalid User');

    foundWebsite.set({ websiteName: website.name });
    await foundWebsite.save();

    return `Website Updated Successfully`;
  }

  // delete website
  async deleteWebsite(
    user: UserDetails,
    websiteId: WebsiteIdDto,
  ): Promise<string> {
    const deletedUser: Website = await this.websiteModel.findOneAndDelete({
      _id: websiteId,
      userId: user.id,
    });
    if (!deletedUser) throw new BadRequestException('Website not found');
    return `Website Deleted Successfully`;
  }
}
