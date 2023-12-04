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

  async findById(id: number): Promise<Comic> {
    const comic = await fetch(
      `https://gateway.marvel.com/v1/public/comics/${id}${generateMarvelURL({
        offset: 0,
        limit: 1,
      })}`,
    );

    if (!comic) {
      throw new NotFoundException({ error: 'no comic found' });
    }

    return await comic.json();
  }

  async createFavoriteComic(
    createComicDto: CreateComicDto,
    authorization,
  ): Promise<Comic> {
    const { sub } = decodeToken(authorization);

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
}
