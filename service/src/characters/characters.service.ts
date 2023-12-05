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

  async findById(id: number): Promise<Character> {
    const character = await fetch(
      `https://gateway.marvel.com/v1/public/characters/${id}${generateMarvelURL(
        { offset: 0, limit: 1 },
      )}`,
    );

    if (!character) {
      throw new NotFoundException({ error: 'no character found' });
    }

    return await character.json();
  }

  async createFavorite(
    createCharacterDto: CreateCharacterDto,
    authorization,
  ): Promise<Character> {
    const { sub } = decodeToken(authorization);

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

  async listAllFavorite(authorization): Promise<Character[]> {
    const { sub } = decodeToken(authorization);

    const findFavoriteCharacters = this.characterModel.find({ user_id: sub });

    if (!findFavoriteCharacters) {
      throw new NotFoundException({ error: 'no favorite character' });
    }

    return findFavoriteCharacters;
  }

  async removeFavorite(authorization, id): Promise<Character> {
    const findCharacter = await this.characterModel.findById(id);

    if (!findCharacter) {
      throw new NotFoundException({ error: 'character not found' });
    }

    if (findCharacter.user_id === decodeToken(authorization).sub) {
      await findCharacter.deleteOne();
    } else {
      throw new ForbiddenException({
        error: 'you are not allowed to delete this character',
      });
    }

    return findCharacter;
  }
}
