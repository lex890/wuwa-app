const BASE_URL = "https://api-v2.encore.moe/api";

export async function getCharacters(lang = "en") {
  const response = await fetch(`${BASE_URL}/${lang}/character`);

  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }

  const data = await response.json();
  return data.roleList ?? [];
}

export async function getCharacter(id, lang = "en") {
  const response = await fetch(
    `${BASE_URL}/${lang}/character/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch character");
  }

  return response.json();
}