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
      `${process.env.MARVEL_API_URL}/comics${generateMarvelURL(
        marvelOptions,
        false,
      )}`,
    );

    return await data.json();
  }

  async findById(param: ParamInterface): Promise<Comic> {
    const response = await fetch(
      `${process.env.MARVEL_API_URL}/comics/${param.id}${generateMarvelURL(
        {
          offset: 0,
          limit: 1,
        },
        false,
      )}`,
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

async seed(sub: string) {
  const green = '\x1b[32m';
  const blue = '\x1b[34m';
  const limit = 100;
  const total = 65041;
  let offset = 0;

  try {
    while (offset < total) {
      const url = `${process.env.MARVEL_API_URL}/comics${generateMarvelURL({ limit, offset }, false)}`;
      const request = await fetch(url);

      if (!request.ok) {
        console.log(`${blue}Failed to fetch data: ${request.status} ${request.statusText}`);
        offset += limit;
        continue;
      }

      const data = await request.json();
      const results = data?.data?.results;
      if (!results || !Array.isArray(results) || results.length === 0) {
        console.log(`${blue}No more comics to seed.`);
        break;
      }

      // Get all comic IDs in this batch
      const ids = results.map((c: any) => c.id);
      // Find existing comics for this user in this batch
      const existing = await this.comicModel.find({ id: { $in: ids }, user_id: sub }).select('id');
      const existingIds = new Set(existing.map((c: any) => c.id));

      // Prepare bulk operations for new comics only
      const ops = results
        .filter((c: any) => !existingIds.has(c.id))
        .map((c: any) => ({
          insertOne: { document: { ...c, user_id: sub } }
        }));

      if (ops.length > 0) {
        await this.comicModel.bulkWrite(ops);
        for (const c of results.filter((c: any) => !existingIds.has(c.id))) {
          console.log(`${green}Created comic: ${blue}${c.title} ${green}added to comics ${blue}${c.id}`);
        }
      }

      for (const c of results.filter((c: any) => existingIds.has(c.id))) {
        console.log(`${green}${c.title} already exists, skipping.`);
      }

      offset += limit;
    }
    console.log(`${green}Comics seeding completed successfully!`);
    return { message: 'Comics seeding completed successfully!' };

  } catch (error) {
    console.error(`${blue}Error seeding comics: ${error.message}`);
    throw new Error('Failed to seed comics');
  }
}
}
