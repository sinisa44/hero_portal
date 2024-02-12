import { Controller, Get } from '@nestjs/common';
import { UiService } from './ui.service';

import { CharactersService } from 'src/characters/characters.service';
import { ComicsService } from 'src/comics/comics.service';
import { CreatorsService } from 'src/creators/creators.service';

import { Character } from 'src/characters/schemas/character.schema';
import { Comic } from 'src/comics/schemas/comic.schema';
import { Creator } from 'src/creators/schemas/Creator.schema';

interface RandomItems {
  character: Character;
  comic: Comic;
  creator: Creator;
}

@Controller('ui')
export class UiController {
  constructor(private readonly uiService: UiService) {}


  @Get('/random')
  getRandomItems():Promise<RandomItems> {
    return this.uiService.fetchRandomItems();
  }
}
