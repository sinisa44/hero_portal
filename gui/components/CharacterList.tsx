"use client";

import { Character } from "@/interfaces/interfaces";
import React from "react";

type Props = {
  characters: Character[] ;
};

const CharacterList = ({ characters }: Props) => {
  console.log(characters);
  return <div>
    <ul>
        {characters.map(character => (
            <li key={character.id}>{character.name}</li>

        ))}
    </ul>
  </div>;
};

export default CharacterList;
