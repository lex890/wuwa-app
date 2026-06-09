import { useEffect, useState } from "react";
import { getCharacters } from "../api/encore.js";

import { Link } from "react-router-dom";

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const data = await getCharacters();
        setCharacters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Characters</h1>
      
      {characters.map((char) => (
        console.log(char),
        <div key={char.Id}>
          <Link to={`/character/${char.Id}`}>
            <h2>{char.Name}</h2>
            <img src={char.RoleHeadIcon} alt={char.Name} />
          </Link>
        </div>
      ))}
    </div>
  );
}