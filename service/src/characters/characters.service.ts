import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';

import generateMarvelURL from './lib/generateMarvleUrl.lib';
import { MarvelOptions } from 'interfaces/character.interface';

import { Character } from './schemas/character.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import decodeToken from './lib/decodeToken.lib';

interface Param {
  id?: number | string;
  authorization?: string;
}

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name)
    private characterModel: Model<Character>,
  ) {}

  async findAll(marvelOptions: MarvelOptions): Promise<Character[]> {
    const data = await fetch(
      `${process.env.MARVEL_API_URL}/characters${generateMarvelURL(
        marvelOptions,
      )}`,
    );

    return await data.json();
  }

  async findById(params: Param): Promise<Character> {
    const characterResponse = await fetch(
      `${process.env.MARVEL_API_URL}/characters/${params.id}${generateMarvelURL(
        {},
      )}`,
    );
    // console.log(characterResponse)

    if (!characterResponse) {
      throw new NotFoundException({ error: 'no character found' });
    }

    const characterData = await characterResponse.json();
    return characterData.data.results[0];
  }

  async createFavorite(
    createCharacterDto: CreateCharacterDto,
    params: Param,
  ): Promise<Character> {
    const { sub } = decodeToken(params.authorization);

    const findCharacter = await this.characterModel.findOne({
      name: createCharacterDto.name,
    });

    if (findCharacter && findCharacter.user_id === sub) {
      throw new ConflictException({
        error: `${findCharacter?.name} is already saved as favorite `,
      });
    }

    const character = await this.characterModel.create({
      ...createCharacterDto,
      user_id: sub,
    });

    return character;
  }

  async saveFavoriteById(
    characterId: number,
    params: Param,
  ): Promise<Character> {
    const { sub } = decodeToken(params.authorization);

    const findCharacterInDatabase = await this.characterModel.findOne({
      id: characterId,
      user_id: sub,
    });

    if (findCharacterInDatabase) {
      throw new ConflictException({
        error: `${findCharacterInDatabase.name} is already saved as favorite`,
      });
    }

    const findCharacter = await this.findById({ id: characterId });

    const newCharacter = await this.characterModel.create({
      ...findCharacter,
      user_id: sub,
    });

    return newCharacter;
  }

  async listAllFavorite(params: Param): Promise<Character[]> {
    const { sub } = decodeToken(params.authorization);

    const findFavoriteCharacters = this.characterModel.find({ user_id: sub });

    if (!findFavoriteCharacters) {
      throw new NotFoundException({ error: 'no favorite character' });
    }

    return findFavoriteCharacters;
  }

  async findFavoriteById(params: Param): Promise<Character> {
    const { sub } = decodeToken(params.authorization);

    const character = await this.characterModel.findOne({
      user_id: sub,
      _id: params.id,
    });

    if (!character) {
      throw new NotFoundException({ error: 'character not found' });
    }

    return character;
  }

  async removeFavorite(params: Param): Promise<Character> {
    const findCharacter = await this.characterModel.findById(params.id);

    if (!findCharacter) {
      throw new NotFoundException({ error: 'character not found' });
    }

    if (findCharacter.user_id === decodeToken(params.authorization).sub) {
      await findCharacter.deleteOne();
    } else {
      throw new ForbiddenException({
        error: 'you are not allowed to delete this character',
      });
    }

    return findCharacter;
  }

  async search(name: string): Promise<Character[] | any> {
    const data = await fetch(
      `${
        process.env.MARVEL_API_URL
      }/characters?nameStartsWith=${name}&orderBy=-name${generateMarvelURL(
        undefined,
        true,
      )}`,
    );

    return await data.json();
  }

  async seed(authorization?: string) {
    try {
      const { sub } = decodeToken(authorization);
      let offset = 0; // Start from 0 to fetch the first set of results
      const limit = 100; // Define the limit once
  
      while (offset < 1500) {
        const request = await fetch(
          `${process.env.MARVEL_API_URL}/characters${generateMarvelURL(
            { limit, offset },
            false,
          )}`,
        );
  
        if (!request.ok) {
          throw new Error(`Failed to fetch data: ${request.statusText}`);
        }
  
        const response = await request.json();
  
        if (!response.data || !response.data.results) {
          throw new Error('Invalid response structure');
        }
  
        for (let i = 0; i < response.data.results.length; i++) {
          const characterData = response.data.results[i];
          const newCharacter = await this.characterModel.create({
            ...characterData,
            user_id: sub,
          });
  
          console.log(newCharacter.name);
        }
  
        offset += limit; // Increment by limit to fetch the next set of results
      }
    } catch (error) {
      console.error('Error seeding characters:', error.message);
    }
  }
}
