import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ThumbnailDto {
  @IsString()
  path: string;

  @IsString()
  extension: string;
}

export class ItemDto {
  @IsString()
  resourceURI: string;

  @IsString()
  name: string;
}

export class CreateCharacterDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  modified: string;

  @ValidateNested()
  @Type(() => ThumbnailDto)
  thumbnail: ThumbnailDto;

  @IsString()
  resourceURI: string;

  @IsNumber()
  available: number;

  @IsString()
  collectionURI: string;

  @ValidateNested()
  @Type(() => ItemDto)
  comics: ItemDto[];

  @IsNumber()
  returned: number;

  @ValidateNested()
  @Type(() => ItemDto)
  series: ItemDto[];

  @ValidateNested()
  @Type(() => ItemDto)
  stories: ItemDto[];

  @IsArray()
  events: any[];

  @IsArray()
  urls: Array<{
    type: string;
    url: string;
  }>;
}
