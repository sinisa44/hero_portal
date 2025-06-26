import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import generateMarvelURL from 'src/characters/lib/generateMarvleUrl.lib';

import { Character } from 'src/characters/schemas/character.schema';
import { Comic } from 'src/comics/schemas/comic.schema';
import { Creator } from 'src/creators/schemas/Creator.schema';

interface RandomItems {
  character: Character;
  comic: Comic;
  creator: Creator;
}

@Injectable()
export class UiService {
  private generateMarvelUrlString(model: string): string {
    return `
            ${process.env.MARVEL_API_URL}/${model}${generateMarvelURL({
              limit: 1,
              offset: Math.floor(Math.random() * 40) + 1,
            })}
        `;
  }

  async fetchRandomItems(): Promise<RandomItems> {
    try {
      const [characterResponse, comicResponse, creatorResponse] =
        await Promise.all([
          fetch(this.generateMarvelUrlString('characters')),
          fetch(this.generateMarvelUrlString('comics')),
          fetch(this.generateMarvelUrlString('creators')),
        ]);

      if (!characterResponse.ok) {
        throw new Error(
          `Failed to fetch characters: ${characterResponse.status} - ${characterResponse.statusText}`,
        );
      }
      if (!comicResponse.ok) {
        throw new Error(
          `Failed to fetch comics: ${comicResponse.status} - ${comicResponse.statusText}`,
        );
      }
      if (!creatorResponse.ok) {
        throw new Error(
          `Failed to fetch creators: ${creatorResponse.status} - ${creatorResponse.statusText}`,
        );
      }

      const characterData = await characterResponse.json();
      const comicData = await comicResponse.json();
      const creatorData = await creatorResponse.json();

      return {
        character: characterData.data,
        comic: comicData.data,
        creator: creatorData.data,
      };
    } catch (error) {
      console.error('Error fetching random items:', error.message);
      throw error; // Re-throw the error to propagate it further if needed
    }
  }
}
