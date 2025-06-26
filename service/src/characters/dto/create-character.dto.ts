import { IsNumber, IsString,  ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


class ItemDto{
  @IsString()
  resourceURI:string

  @IsString()
  name:string
}

class ThumbnailDto{
  @IsString()
  path:string

  @IsString()
  extension:string
}

class UrlDto{
  @IsString()
  type:string
  
  @IsString()
  url: string
}

class ResourceDto{
  @IsNumber()
  available: number

  @IsString()
  collectionURI: string

  @ValidateNested()
  @Type(() => ItemDto)
  items:ItemDto[]

  @IsNumber()
  returned: number
}

export class CreateCharacterDto{
  @IsNumber()
  id:number

  @IsString()
  name:string

  @IsString()
  description:string

  @IsString()
  modified: string

  @ValidateNested()
  @Type(() => ThumbnailDto)
  thumbnail:ThumbnailDto


  @IsString()
  resourceURI: string

  @ValidateNested()
  @Type(() => ResourceDto)
  comics:ResourceDto[]

  @ValidateNested()
  @Type(() => ResourceDto)
  series:ResourceDto[]

  @ValidateNested()
  @Type(() => ResourceDto)
  events:ResourceDto[]

  @ValidateNested()
  @Type(() => UrlDto)
  urls:UrlDto[]
}
