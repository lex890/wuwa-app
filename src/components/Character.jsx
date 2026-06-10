import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCharacter } from "../api/encore.js";

export default function Character() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    getCharacter(id).then(setCharacter);
  }, [id]);

  if (!character) return <p>Loading...</p>;

  return (
    <div>
      <h1>{character.name}</h1>
      <pre>{JSON.stringify(character, null, 2)}</pre>
    </div>
  );
}