import { useEffect, useState } from "react";
import { getCharacter, getCharactersId } from "../api/encore.js";

import { Link } from "react-router-dom";

async function getFullRoster() {
  const cached = localStorage.getItem("roster");

  if (cached) {
    console.log("Using cached roster");
    return JSON.parse(cached);
  }

  console.log("Fetching roster");

  const idList = await getCharactersId();

  const rosterList = await Promise.all(
    idList.map(id => getCharacter(id))
  );

  localStorage.setItem("roster", JSON.stringify(rosterList));

  return rosterList;
}

/*
function clearCache() {
  localStorage.removeItem("roster");
}
*/

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const data = await getFullRoster();
        setCharacters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, []);
  console.log(characters)
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Characters</h1>
      
      {characters.map((char) => (
        <div key={char.Id}>
          <Link to={`/character/${char.Id}`}>
            <h2>{char.Name}</h2>
            <img src={char.RolePortrait} alt={char.Name.Content} />
          </Link>
        </div>
      ))}
    </div>
  );
}