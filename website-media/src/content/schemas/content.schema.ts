import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ContentCategory } from 'src/utils/enums/content-category.enum';

export interface ContentDocument extends HydratedDocument<Content> {
  sectionId: Types.ObjectId;
  title: string;
  url: string;
  type: ContentCategory;
}

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Content {
  @Prop({ type: Types.ObjectId, ref: 'Section', required: true })
  sectionId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  url: string;

  @Prop({ enum: ContentCategory })
  type: ContentCategory;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
