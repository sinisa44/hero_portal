import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { MarvelOptions } from 'interfaces/character.interface';
import generateMarvelURL from 'src/characters/lib/generateMarvleUrl.lib';
import { Creator } from './schemas/Creator.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import decodeToken from 'src/characters/lib/decodeToken.lib';
import { CreateCreatorDto } from './dtos/create-creator.dto';

interface Param {
  id?: number | string;
  authorization?: string;
}

@Injectable()
export class CreatorsService {
  constructor(
    @InjectModel(Creator.name)
    private creatorModel: Model<Creator>,
  ) {}

  async fetchAll(marvelOptions: MarvelOptions): Promise<Creator[]> {
    const data = await fetch(`
       ${process.env.MARVEL_API_URL}/creators${generateMarvelURL(
          marvelOptions,
        )}`);

    return await data.json();
  }

  async fetchById(params: Param): Promise<Creator> {
    const creator = await fetch(`
        ${process.env.MARVEL_API_URL}/creators/${
          params.id
        }${generateMarvelURL({
          limit: 1,
          offset: 0,
        })}
    `);

    return await creator.json();
  }

  async listAllFavorites(params: Param): Promise<Creator[]> {
    const { sub } = decodeToken(params.authorization);

    const favoriteCreators = await this.creatorModel.find({ user_id: sub });

    if (!favoriteCreators) {
      throw new NotFoundException({ error: 'No favorite creators found' });
    }
    return favoriteCreators;
  }

  async fetchFavoriteById(params: Param) : Promise<Creator>{
      const {sub} = decodeToken(params.authorization);

      const creator = await this.creatorModel.findOne({user_id: sub, _id:params.id})

      if(!creator) {
        throw new NotFoundException({error: 'no creator found'})
      }

      return creator
  }

  async saveFavorite(
    
    params: Param,
    createCreatorDto: CreateCreatorDto,
  ): Promise<Creator> {
    const { sub } = decodeToken(params.authorization);
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

  async removeFavorite(params: Param): Promise<Creator> {
    const { sub } = decodeToken(params.authorization);
    const findCreator = await this.creatorModel.findOne({
      _id: params.id,
      user_id: sub,
    });

    if (!findCreator) {
      throw new NotFoundException({ error: 'No creator found' });
    } else {
      await findCreator.deleteOne();

      return findCreator;
    }
  }
}
