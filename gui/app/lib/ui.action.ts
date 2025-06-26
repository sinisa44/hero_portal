"use server";

import { Creator, Character, Comic } from "@/interfaces/interfaces";
import { UI } from "@/lib/endpoints";

const URLString = `${process.env.API_HOST}/${UI.baseURL}`;

interface RandomItemsPayload {
  character: Character;
  creator: Creator;
  comic: Comic;
}

export const fetchRandomValues = async (): Promise<RandomItemsPayload> => {
  try {
    const response = await fetch(URLString);

    if (!response.ok) {
      throw new Error(
        `there was an error while fetching ${response.status} - ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return Promise.reject(error);
  
  }
};

// export const fetchRandomCharacters = async() => {}
// export const fetchRandomComics = async() => {}
// export const fetchRandomCreators = async() => {}