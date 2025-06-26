import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';

interface URLInterface {
  type: string;
  url: string;
}

class ResourceDto {
  @IsNumber()
  available: number;

  @IsString()
  collectionURI: string;

  @ValidateNested()
  @IsArray()
  items: Array<{
    resourceURI: string;
    name: string;
  }>;

  returned: number;
}

export class CreateCreatorDto {
  @IsNumber()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  suffix: string;

  @IsString()
  fullName: string;

  @IsString()
  modified: string;

  @ValidateNested()
  @IsObject()
  thumbnail: {
    path: string;
    extension: string;
  };

  @IsString()
  resourceURI: string;

  @ValidateNested()
  @IsObject()
  @Type(() => ResourceDto)
  comics: ResourceDto[];

  @ValidateNested()
  @IsObject()
  @Type(() => ResourceDto)
  series: ResourceDto[];

  @ValidateNested()
  @IsObject()
  @Type(() => ResourceDto)
  stories: ResourceDto[];
  @ValidateNested()
  @IsObject()
  @Type(() => ResourceDto)
  events: ResourceDto[];

  @IsArray()
  @ValidateNested()
  urls: URLInterface[];
}
