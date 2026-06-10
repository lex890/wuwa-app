import fs from "fs";

const BASE_URL = "https://api-v2.encore.moe/api";

function saveJSON(data, filename = "wuwa.json") {
  fs.writeFileSync(
    filename,
    JSON.stringify(data, null, 2),
    "utf-8"
  );

  console.log(`Saved ${filename}`);
}


async function getCharactersId(lang = "en") {
  const response = await fetch(`${BASE_URL}/${lang}/character`);

  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }

  const data = await response.json();

  return (data.roleList ?? []).map(c => c.Id);
}

async function getCharacter(id, lang = "en") {
  const response = await fetch(`${BASE_URL}/${lang}/character/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch character ${id}`);
  }

  return response.json();
}

async function dumpAllCharacters() {
  const ids = await getCharactersId();

  const results = [];

  for (const id of ids) {
    try {
      const character = await getCharacter(id);
      results.push(character);
    } catch (err) {
      console.error("Failed id:", id, err);
    }
  }

  saveJSON(results, "wuwa-characters.json");
}

dumpAllCharacters();