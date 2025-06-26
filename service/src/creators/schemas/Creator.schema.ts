import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type ResourceType = {
  available: string;
  collectionURI: string;
  items: Array<{
    resourceURI: string;
    name: string;
  }>;

  returned: number;
};

@Schema()
export class Creator extends Document {
  @Prop()
  id: number;

  @Prop()
  user_id:string;

  @Prop()
  firstName: string;

  @Prop()
  middleName?: string;

  @Prop()
  lastName: string;

  @Prop()
  suffix: string;

  @Prop()
  fullName: string;

  @Prop()
  modified: string;

  @Prop({ type: Object })
  thumbnail: {
    path: string;
    extension: string;
  };

  @Prop({ type: String })
  resourceURI: string;

  @Prop({ type: Object })
  comics: ResourceType;

  @Prop({ type: Object })
  series: ResourceType;

  @Prop({ type: Object })
  stories: ResourceType;

  @Prop({ type: Object })
  events: ResourceType;

  @Prop({ type: Array })
  urls: Array<{
    type: string;
    url: string;
  }>;
}

export const CreatorSchema = SchemaFactory.createForClass(Creator);
