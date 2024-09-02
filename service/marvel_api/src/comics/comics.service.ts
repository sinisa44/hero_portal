import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { MarvelOptions } from 'interfaces/character.interface';

import generateMarvelURL from 'src/characters/lib/generateMarvleUrl.lib';
import { CreateComicDto } from './dto/create-comic.dto';
import decodeToken from 'src/characters/lib/decodeToken.lib';
import { InjectModel } from '@nestjs/mongoose';
import { Comic } from './schemas/comic.schema';
import { Model } from 'mongoose';

interface ParamInterface {
  id?: number | string;
  authorization?: string;
}

@Injectable()
export class ComicsService {
  constructor(
    @InjectModel(Comic.name)
    private comicModel: Model<Comic>,
  ) {}

  async findAll(marvelOptions: MarvelOptions): Promise<Comic[]> {
    const data = await fetch(
      `https://gateway.marvel.com/v1/public/comics${generateMarvelURL(
        marvelOptions,
      )}`,
    );

    return await data.json();
  }

  async findById(param: ParamInterface): Promise<Comic> {
    const response = await fetch(
      `https://gateway.marvel.com/v1/public/comics/${
        param.id
      }${generateMarvelURL({
        offset: 0,
        limit: 1,
      })}`,
    );

    if (!response.ok) {
      throw new NotFoundException({ error: 'no comic found' });
    }
    const comicData = await response.json();

    return comicData.data.results[0];

  }
  async createFavoriteById(params: ParamInterface, id: number): Promise<Comic> {
    const { sub } = decodeToken(params.authorization);

    const checkIfComicIsSaved = await this.comicModel.findOne({
      id,
      user_id: sub,
    });

    if (checkIfComicIsSaved) {
      throw new ConflictException({
        error: `${checkIfComicIsSaved.title} is already saved`,
      });
    }

    const findComic = await this.findById({ id });

    const newComic = await this.comicModel.create({
      ...findComic,
      user_id: sub,
    });

    return newComic;
  }

  async createFavoriteComic(
    createComicDto: CreateComicDto,
    paramInterface: ParamInterface,
  ): Promise<Comic> {
    const { sub } = decodeToken(paramInterface.authorization);

    const findComic = await this.comicModel.findOne({
      name: createComicDto.title,
    });

    if (findComic && findComic.user_id === sub) {
      throw new ConflictException({
        error: `${findComic.title} is already saved as favorite`,
      });
    }

    const comic = await this.comicModel.create({
      ...createComicDto,
      user_id: sub,
    });

    return comic;
  }

  async findAllFavorites(params: ParamInterface): Promise<Comic[]> {
    const { sub } = decodeToken(params.authorization);

    const findFavoriteComics = await this.comicModel.find({ user_id: sub });

    if (!findFavoriteComics) {
      throw new NotFoundException({ error: 'no favorite comics' });
    }

    return findFavoriteComics;
  }

  async findFavoriteById(params: ParamInterface): Promise<Comic> {
    const { sub } = decodeToken(params.authorization);

    const comic = await this.comicModel.findOne({
      user_id: sub,
      _id: params.id,
    });

    if (!comic) {
      throw new NotFoundException({ error: 'no comic found' });
    }

    return comic;
  }

  async removeFavorite(params: ParamInterface): Promise<Comic> {
    const { sub } = decodeToken(params.authorization);

    const findComic = await this.comicModel.findOne({
      user_id: sub,
      _id: params.id,
    });

    if (!findComic) {
      throw new NotFoundException({ error: 'comic not found' });
    }

    await findComic.deleteOne();

    return findComic;
  }
}
