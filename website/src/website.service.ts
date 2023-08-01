import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Website } from './schemas/website.schema';

// DTO
import { WebsiteNameDto } from './dto/website-name.dto';
import { WebsiteIdDto } from './dto/website-Id.dto';

// utils
import { UserDetails } from '@mujtaba-web/common';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(Website.name) private websiteModel: Model<Website>,
  ) {}

  // check website name
  async checkWebsiteName(websiteName: string): Promise<boolean> {
    const foundWebsite = await this.websiteModel.findOne({ websiteName });
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
    console.log(foundWebsites);
    return foundWebsites;
  }

  // get user websites
  async createWebsite(
    user: UserDetails,
    website: WebsiteNameDto,
  ): Promise<Website> {
    if (this.checkWebsiteName)
      throw new BadRequestException('Website Already Taken');

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
    website: WebsiteNameDto,
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
