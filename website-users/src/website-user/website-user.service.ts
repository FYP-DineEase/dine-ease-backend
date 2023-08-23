import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import {
  UserDetails,
  WebsiteUserDetails,
  WebsiteUserRoles,
} from '@mujtaba-web/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WebsiteDocument } from 'src/website/schemas/website.schema';
import {
  WebsiteUser,
  WebsiteUserDocument,
} from './schemas/website-user.schema';

@Injectable()
export class WebsiteUserService {
  constructor(
    private readonly jwtAuthService: JwtService,
    @InjectModel(WebsiteUser.name)
    private websiteUser: Model<WebsiteUserDocument>,
  ) {}

  // current user
  currentUser(websiteUser: WebsiteUserDetails, websiteId: string) {
    if (websiteUser.websiteId === websiteId) {
      return websiteUser;
    }
    throw new UnauthorizedException('Invalid Website User');
  }

  // find user account
  async findUser(
    websiteUser: WebsiteUserDetails,
    websiteId: string,
  ): Promise<WebsiteUserDocument> {
    const foundUser: WebsiteUserDocument = await this.websiteUser.findOne({
      userId: websiteUser.id,
      websiteId,
    });
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }

  // website user account
  async auth(user: UserDetails, website: WebsiteDocument): Promise<string> {
    const { id, email, fullName, profilePicture } = user;
    const foundUser: WebsiteUserDocument = await this.websiteUser.findOne({
      userId: id,
      websiteId: website.websiteId,
    });

    if (!foundUser) {
      const createdUser = new this.websiteUser({
        userId: id,
        websiteId: website.websiteId,
        email,
      });
      await createdUser.save();
    }

    const userRole = () => {
      if (website.userId.toString() === id) {
        return WebsiteUserRoles.ADMIN;
      }
      return WebsiteUserRoles.USER;
    };

    const payload: WebsiteUserDetails = {
      id,
      fullName,
      email,
      websiteId: website.websiteId.toString(),
      websiteRole: userRole(),
      profilePicture,
    };
    const token: string = this.jwtAuthService.sign(payload);
    return token;
  }
}
