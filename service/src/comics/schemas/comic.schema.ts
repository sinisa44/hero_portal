import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Comic extends Document {
  @Prop()
  id: number;

  @Prop()
  user_id: string;

  @Prop()
digitalId: number;

  @Prop()
  title: string;

  @Prop()
  issueNumber: number;

  @Prop()
  variantDescription: string;

  @Prop()
  description: string;

  @Prop()
  modified: string;

  @Prop()
  isbn: string;

  @Prop()
  upc: string;

  @Prop()
  diamondCode: string;

  @Prop()
  ean: string;

  @Prop()
  issn: string;

  @Prop()
  format: string;

  @Prop()
  pageCount: number;

  @Prop({ type: Array })
  textObjects: Array<{
    type: string;
    language: string;
    text: string;
  }>;

  @Prop()
  resourceURI: string;

  @Prop({ type: Array })
  urls: Array<{
    type: string;
    url: string;
  }>;

  @Prop({ type: Object })
  series: {
    resourceURI: string;
    name: string;
  };

  @Prop({ type: Array })
  variants: Array<any>;

  @Prop({ type: Array })
  collections: Array<any>;

  @Prop({ type: Array })
  collectedIssues: Array<any>;

  @Prop({ type: Array })
  dates: Array<{
    type: string;
    date: string;
  }>;

  @Prop({ type: Array })
  prices: Array<{
    type: string;
    price: number;
  }>;

  @Prop({ type: Object })
  thumbnail: {
    path: string;
    extension: string;
  };

  @Prop({ type: Array })
  images: Array<{
    path: string;
    extension: string;
  }>;

  @Prop({ type: Object })
  creators: {
    available: number;
    collectionURI: string;
    items: Array<any>;
    returned: number;
  };

  @Prop({ type: Object })
  characters: {
    available: number;
    collectionURI: string;
    items: Array<any>;
    returned: number;
  };

  @Prop({ type: Object })
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
    returned: number;
  };

  @Prop({ type: Object })
  events: {
    available: number;
    collectionURI: string;
    items: Array<any>;
    returned: number;
  };
}

export const ComicSchema = SchemaFactory.createForClass(Comic);
