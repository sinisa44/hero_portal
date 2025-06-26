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
import { create } from 'domain';

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
        ${process.env.MARVEL_API_URL}/creators/${params.id}${generateMarvelURL({
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

  async fetchFavoriteById(params: Param): Promise<Creator> {
    const { sub } = decodeToken(params.authorization);

    const creator = await this.creatorModel.findOne({
      user_id: sub,
      _id: params.id,
    });

    if (!creator) {
      throw new NotFoundException({ error: 'no creator found' });
    }

    return creator;
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

async seed() {
  const green = '\x1b[32m';
  const blue = '\x1b[34m';
  const limit = 100;
  const total = 6537;
  let offset = 0;

  console.log('Seeding creators...');
  try {
    while (offset < total) {
      const url = `${process.env.MARVEL_API_URL}/creators${generateMarvelURL({ limit, offset }, false)}`;
      const request = await fetch(url);

      if (!request.ok) {
        const errorText = await request.text();
        console.log(`Failed to fetch data: ${request.status} ${request.statusText} - ${errorText}`);
        offset += limit;
        continue;
      }

      const response = await request.json();
      const results = response?.data?.results;
      if (!results || !Array.isArray(results)) {
        console.log(`${blue}Invalid response structure: ${JSON.stringify(response, null, 2)}`);
        offset += limit;
        continue;
      }

      // Get all creator IDs in this batch
      const ids = results.map((c: any) => c.id);
      // Find existing creators in this batch
      const existing = await this.creatorModel.find({ id: { $in: ids } }).select('id');
      const existingIds = new Set(existing.map((c: any) => c.id));

      // Prepare bulk operations for new creators only
      const ops = results
        .filter((c: any) => !existingIds.has(c.id))
        .map((c: any) => ({
          insertOne: { document: { ...c } }
        }));

      if (ops.length > 0) {
        await this.creatorModel.bulkWrite(ops);
        for (const c of results.filter((c: any) => !existingIds.has(c.id))) {
          console.log(`${green}Creator ${blue}${c.firstName}${green} added successfully! ${blue}${c.id}`);
        }
      }

      for (const c of results.filter((c: any) => existingIds.has(c.id))) {
        console.log(`${blue}Creator ${green}${c.firstName}${blue} already exists, skipping...`);
      }

      offset += limit;
    }
  } catch (error) {
    console.error('Error seeding creators:', error.message);
  }
}
}
