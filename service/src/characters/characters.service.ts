import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

import generateMarvelURL from './lib/generateMarvleUrl.lib';
import { MarvelOptions } from 'interfaces/character.interface';

import { Character } from './schemas/character.schema';
import {InjectModel} from '@nestjs/mongoose'
import { Model } from 'mongoose';
import {Request} from 'express'
import decodeToken from './lib/decodeToken.lib';

@Injectable()
export class CharactersService {
  constructor(@InjectModel(Character.name)
  private characterModel: Model<Character>,
  ){}


 async create(createCharacterDto: CreateCharacterDto, authorization): Promise<Character>  {
  const {sub} = decodeToken(authorization)

  const findCharacter = await this.characterModel.findOne({name: createCharacterDto.name});

  if(findCharacter) {
    throw new ConflictException({error:`${findCharacter?.name} is already saved as favorite `})
  } 

    const character =  await this.characterModel.create({...createCharacterDto, user_id: sub}); 
  
    return character;
  }

  async findAll(marvelOptions: MarvelOptions): Promise<Character[]> {

    const data = await fetch(
      `https://gateway.marvel.com/v1/public/characters${generateMarvelURL(
        marvelOptions,
      )}`,
    );

    return await data.json();
  }

  findOne(id: number) {
    return `This action returns a #${id} character`;
  }

  update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }
}
