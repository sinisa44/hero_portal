import { Injectable, ConflictException } from '@nestjs/common';
import { MarvelOptions } from 'interfaces/character.interface';
import generateMarvelURL from 'src/characters/lib/generateMarvleUrl.lib';
import { Creator } from './schemas/Creator.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import decodeToken from 'src/characters/lib/decodeToken.lib';
import { CreateCreatorDto } from './dtos/create-creator.dto';

@Injectable()
export class CreatorsService {
  constructor(
    @InjectModel(Creator.name)
    private creatorModel: Model<Creator>,
  ) {}

  async fetchAll(marvelOptions: MarvelOptions): Promise<Creator[]> {
    const data = await fetch(`
        https://gateway.marvel.com/v1/public/creators${generateMarvelURL(
          marvelOptions,
        )}`);

    return await data.json();
  }

  async fetchById(id: number): Promise<Creator> {
    const creator = await fetch(`
        https://gateway.marvel.com/v1/public/creators/${id}${generateMarvelURL({
          limit: 1,
          offset: 0,
        })}
    `);

    return await creator.json();
  }

  async saveFavorite(
    authorization,
    createCreatorDto: CreateCreatorDto,
  ): Promise<Creator> {
    const { sub } = decodeToken(authorization);
    const findCreator = await this.creatorModel.findOne({
      id: createCreatorDto.id,
      user_id: sub,
    });

    if (!findCreator) {
      const favoriteCreator = await this.creatorModel.create({
        ...createCreatorDto,
        user_id: sub,
      });

      return favoriteCreator;
    } else {
      throw new ConflictException({
        error: 'Creator already inserted as favorite',
      });
    }
  }
}
