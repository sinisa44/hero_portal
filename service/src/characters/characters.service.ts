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
      `https://gateway.marvel.com/v1/public/characters${generateMarvelURL(
        marvelOptions,
      )}`,
    );

    return await data.json();
  }

  async findById(params: Param): Promise<Character> {
    const character = await fetch(
      `https://gateway.marvel.com/v1/public/characters/${
        params.id
      }${generateMarvelURL({ offset: 0, limit: 1 })}`,
    );

    if (!character) {
      throw new NotFoundException({ error: 'no character found' });
    }

    return await character.json();
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
      _id: params.id ,
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
}
