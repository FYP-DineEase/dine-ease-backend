import { Injectable, NotFoundException } from '@nestjs/common';
import { WebsiteUserDetails } from '@mujtaba-web/common';
import { SectionService } from 'src/section/section.service';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Content, ContentDocument } from './schemas/content.schema';

// DTO
import { ContentDto } from './dto/content.dto';

@Injectable()
export class ContentService {
  constructor(
    private readonly sectionService: SectionService,
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
  ) {}

  // Create Section
  async createContent(
    user: WebsiteUserDetails,
    sectionId: Types.ObjectId,
    contentDto: ContentDto,
  ): Promise<string> {
    // check if section exist or not
    const section = await this.sectionService.findSectionById(sectionId);

    const content = new this.contentModel({
      userId: user.id,
      sectionId,
      ...contentDto,
    });
    await content.save();

    // update section
    section.media.push(content._id);
    await section.save();

    return 'Content Created Successfully';
  }

  // Update Content
  async updateContentDetails(
    contentId: Types.ObjectId,
    contentDto: ContentDto,
  ): Promise<string> {
    const content: ContentDocument = await this.contentModel.findByIdAndUpdate(
      contentId,
      contentDto,
    );

    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return `Content Updated Successfully`;
  }

  // delete Section
  async deleteContent(contentId: Types.ObjectId): Promise<string> {
    const content: ContentDocument = await this.contentModel.findByIdAndDelete(
      contentId,
    );

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // update section
    await this.sectionService.updateSectionMedia(
      content.sectionId,
      content._id,
    );
    return `Section Deleted Successfully`;
  }
}
