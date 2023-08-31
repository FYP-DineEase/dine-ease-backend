// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@mujtaba-web/common';
import { PlaylistModule } from 'src/playlist/playlist.module';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { Section, SectionSchema } from './schemas/Section.schema';

@Module({
  imports: [
    JwtAuthModule,
    PlaylistModule,
    MongooseModule.forFeature([{ name: Section.name, schema: SectionSchema }]),
  ],
  providers: [SectionService],
  controllers: [SectionController],
  exports: [SectionService],
})
export class SectionModule {}
