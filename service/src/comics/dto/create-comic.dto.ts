import { IsArray, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ResourceDto {
  @IsNumber()
  available: number;

  @IsString()
  collectionURI: string;

  @IsArray()
  items: [];

  @IsNumber()
  returned: number;
}

class UrlDto {
  @IsString()
  type: string;

  @IsString()
  url: string;
}

class DatesDto {
  @IsString()
  type: string;

  @IsString()
  date: number;
}

export class CreateComicDto {
  @IsNumber()
  id: number;

  @IsNumber()
  digitalId: number;

  @IsString()
  title: string;

  @IsNumber()
  issueNumber: number;

  @IsString()
  variantDescription: string;

  @IsString()
  description: string;

  @IsString()
  modified: string;

  @IsString()
  isbn: string;

  @IsString()
  upc: string;

  @IsString()
  diamondCode: string;

  @IsString()
  ean: string;

  @IsString()
  issn: string;

  @IsString()
  format: string;

  @IsNumber()
  pageCount: number;

  @IsArray()
  textObjects: [];

  @IsString()
  resourceURI: string;

  @ValidateNested()
  @IsArray()
  urls: Array<{
    type: string;
    url: string;
  }>;

  @ValidateNested()
  // @IsArray()
  series:{
    resourceURI: string;
    name: string;
  };

  @ValidateNested()
  @IsArray()
  variants: Array<{
    resourceURI: string;
    name: string;
  }>;

  @IsArray()
  collections: Array<any>;

  @IsArray()
  collectedIssues: Array<any>;

  @ValidateNested()
  @Type(() => DatesDto)
  dates: DatesDto[];

  @ValidateNested()
 @IsArray()
  prices: Array<{
    type:string,
    price:number | string
  }>;

  @ValidateNested()
  @IsObject()
  thumbnail: {
    path: string;
    extension: string;
  };

  @IsArray()
  images: Array<any>;

  @ValidateNested()
  @Type(() => ResourceDto)
  creators: ResourceDto;

  @ValidateNested()
  @Type(() => ResourceDto)
  characters: ResourceDto;

  @ValidateNested()
  @Type(() => ResourceDto)
  stories: ResourceDto;

  @ValidateNested()
  @Type(() => ResourceDto)
  events: ResourceDto;
}
