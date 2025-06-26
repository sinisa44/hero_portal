import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';

import { Character, CharacterSchema } from './schemas/character.schema';
import {MongooseModule} from '@nestjs/mongoose'

@Module({
  imports:[
    MongooseModule.forFeature([{name:Character.name, schema:CharacterSchema}])
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService],
})
export class CharactersModule {}
