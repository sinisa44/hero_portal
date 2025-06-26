import { Command, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CharactersService } from './characters.service';

@Injectable()
export class CharacterCommand {
  constructor(private readonly charactersService: CharactersService) {}

@Command({
  command: 'seed:character',
  describe: 'seed a character',
})
async seed(
  @Option({
  name: 'The sub of the user to seed the character for',
    type:'string',
    required: true,
    default: false
  })
  sub: string,
) {
  console.log('Seeding characters... 123');
 return this.charactersService.seed(sub);
}
}