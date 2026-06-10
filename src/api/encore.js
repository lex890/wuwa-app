

const BASE_URL = "https://api-v2.encore.moe/api";

export async function getCharactersId(lang = "en") {
  const response = await fetch(`${BASE_URL}/${lang}/character`);

  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }

  const data = await response.json();

  return (data.roleList ?? []).map(character => character.Id);
}

export async function getCharacter(id, lang = "en") {
  const response = await fetch(
    `${BASE_URL}/${lang}/character/${id}`
  );

  console.log(response.status, response.statusText);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch character: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}