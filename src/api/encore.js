import fs from "fs";

const BASE_URL = "https://api-v2.encore.moe/api";
const category = "echo" // character / weapon / echo / items / etc...

function saveJSON(data, filename = "wuwa.json") {
  fs.writeFileSync(
    filename,
    JSON.stringify(data, null, 2),
    "utf-8"
  );

  console.log(`Saved ${filename}`);
}


async function getWeapons(lang = "en") {
  const response = await fetch(`${BASE_URL}/${lang}/${category}`);

  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }

  const data = await response.json();

  return data.Echo;
}


async function dumpAllCharacters() {
  const ids = await getWeapons();

  saveJSON(ids, "wuwa-echoes.json");
}

dumpAllCharacters();