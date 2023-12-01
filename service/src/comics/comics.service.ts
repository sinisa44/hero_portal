import { Injectable } from '@nestjs/common';
import { MarvelOptions } from 'interfaces/character.interface';
import { Comic } from 'interfaces/comic.inteface';
import generateMarvelURL from 'src/characters/lib/generateMarvleUrl.lib';

@Injectable()
export class ComicsService {
  async findAll(marvelOptions: MarvelOptions): Promise<Comic[]> {
    const data = await fetch(
      `https://gateway.marvel.com/v1/public/comics${generateMarvelURL(
        marvelOptions,
      )}`,
    );

    return await data.json();
  }
}
