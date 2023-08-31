import { Injectable, NotFoundException } from '@nestjs/common';
import { WebsiteUserDetails } from '@mujtaba-web/common';
import { PlaylistService } from 'src/playlist/playlist.service';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Section, SectionDocument } from './schemas/Section.schema';

// DTO
import { SectionDto } from './dto/section.dto';

@Injectable()
export class SectionService {
  constructor(
    private readonly playlistService: PlaylistService,
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
  ) {}

  // verify section by id
  async findSectionById(id: Types.ObjectId): Promise<SectionDocument> {
    const section: SectionDocument = await this.sectionModel.findById(id);
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  // update section
  async updateSectionMedia(
    sectionId: Types.ObjectId,
    contentId: Types.ObjectId,
  ): Promise<SectionDocument> {
    const section: SectionDocument = await this.sectionModel.findByIdAndUpdate(
      sectionId,
      { $pull: { media: contentId } },
    );
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  // find all Section
  async findAllSection(playlistId: Types.ObjectId): Promise<SectionDocument[]> {
    const sections: SectionDocument[] = await this.sectionModel.find({
      playlistId,
    });
    return sections;
  }

  // create Section
  async createSection(
    user: WebsiteUserDetails,
    playlistId: Types.ObjectId,
    sectionDto: SectionDto,
  ): Promise<string> {
    const playlist = await this.playlistService.findPlaylistById(playlistId);

    const section = new this.sectionModel({
      userId: user.id,
      playlistId,
      ...sectionDto,
    });
    await section.save();

    // update playlist section
    playlist.sections.push(section._id);
    await playlist.save();

    return 'Section Created Successfully';
  }

  // update Section
  async updateSectionDetails(
    sectionId: Types.ObjectId,
    sectionDto: SectionDto,
  ): Promise<string> {
    const section: SectionDocument = await this.sectionModel.findByIdAndUpdate(
      sectionId,
      sectionDto,
    );

    if (!section) {
      throw new NotFoundException('Section not found');
    }
    return `Section Updated Successfully`;
  }

  // delete Section
  async deleteSection(sectionId: Types.ObjectId): Promise<string> {
    const section: SectionDocument = await this.sectionModel.findByIdAndDelete(
      sectionId,
    );

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    // update playlist section
    await this.playlistService.updatePlaylistSection(
      section.playlistId,
      section._id,
    );
    return `Section Deleted Successfully`;
  }
}
