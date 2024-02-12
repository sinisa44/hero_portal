import CharacterList from "@/components/CharacterList";
import { fetchCharacters } from "./lib/character.action";
import { Link } from "lucide-react";
export default async function Home() {
  const characters = await fetchCharacters(1, 10);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CharacterList characters={characters} />
    </main>
  );
}
