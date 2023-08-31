// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@mujtaba-web/common';
import { SectionModule } from 'src/section/section.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Content, ContentSchema } from './schemas/content.schema';

@Module({
  imports: [
    JwtAuthModule,
    SectionModule,
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
  ],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService],
})
export class ContentModule {}
