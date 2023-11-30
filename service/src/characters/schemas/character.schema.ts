import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Character extends Document {
  @Prop()
  id: number;

  @Prop()
  user_id:string

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  modified: string;

  @Prop({type:Object})
  thumbnail: {
    path: string;
    extension: string;
  };

  @Prop()
  resourceURI: string;

  @Prop({type:Object})
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
    returned: number;
  };

  @Prop({type:Object})
  series: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
    returned: number;
  };

  @Prop({type:Object})
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

  @Prop({type:Object})
  events: {
    available: number;
    collectionURI: string;
    items: Array<any>;
    returned: number;
  };

  @Prop({type:Array})
  urls: Array<{
    type: string;
    url: string;
  }>;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
