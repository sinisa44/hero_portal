"use server";

import { Character } from "@/interfaces/interfaces";
import { characters } from "@/lib/endpoints";

/**
 * Fetches character data from an API based on the provided parameters.
 * @param {number} id - The ID of the character to fetch (optional).
 * @param {number} offset - The offset for paginating characters (optional).
 * @param {number} limit - The limit of characters to fetch (optional).
 * @returns {Promise} A promise that resolves to the fetched character data or an error object.
 */

const URLString = `${process.env.API_HOST}/${characters.baseURL}`;

export const fetchCharacters = async (
  offset?: number,
  limit?: number
): Promise<Character[]> => {
  try {
    const response = await fetch(
      `${URLString}/all?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("there was an error while fetching characters");
    }
    const responseData = await response.json();

    return responseData.data.results;
  } catch (error) {
    console.log(error);

    return Promise.reject(error);
  }
};

export const fetchCharacter = async (id: number): Promise<Character> => {
  try {
    const response = await fetch(`${URLString}/${id}`);

    if (!response.ok) {
      throw new Error(`there was an error while fetching character`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
