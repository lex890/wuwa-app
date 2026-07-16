import { supabase } from "./supabase";
import { getCachedData, setCachedData } from "../utils/local";

const CACHE_KEY = "wuwa-data";

function reshapeData(data = {}) {
  return {
    characters: data.characters ?? [],
    weapons: data.weapons ?? [],
    echoes: data.echoes ?? [],
  };
}

// ----------------------
// Generic DB fetch
// ----------------------
async function fetchTable(tableName) {
  console.log(`Fetching DB: ${tableName}`);

  const { data, error } = await supabase
    .from(tableName)
    .select("*");

  if (error) throw error;

  return data ?? [];
}

// ----------------------
// Generic JSON fetch
// ----------------------
async function fetchJSON(url) {
    const response = await fetch(url);

    console.log(url);
    console.log(response.status);
    console.log(response.headers.get("content-type"));

    const text = await response.text();
    console.log(text.slice(0, 200));

    return JSON.parse(text);
}

// ----------------------
// Controller: Load from DB
// ----------------------
async function fetchDatabaseData() {
  console.log("fetching in DB")
  const [characters, weapons, echoes] = await Promise.all([
    fetchTable("wuwa_characters"),
    fetchTable("wuwa_weapons"),
    fetchTable("wuwa_echoes"),
  ]);
  const data = reshapeData({
    characters,
    weapons,
    echoes,
  });

  setCachedData(data, CACHE_KEY);

  return data;
}

// ----------------------
// Controller: Load from JSON
// ----------------------
async function fetchJSONData() {
  const [characters, weapons, echoes] = await Promise.all([
    fetchJSON("/public/wuwa-characters.json"),
    fetchJSON("/public/wuwa-weapons.json"),
    fetchJSON("/public/wuwa-echoes.json"),
  ]);
  console.log(characters)
  console.log(weapons)
  console.log(echoes)
  const data = reshapeData({
    characters,
    weapons,
    echoes,
  });
  console.log("data: ")
  console.log(data)
  setCachedData(data, CACHE_KEY);

  return data;
}

// ----------------------
// Public API
// ----------------------
async function readData({ source = "auto" } = {}) {
  switch (source) {
    case "cache":
      return reshapeData(getCachedData(CACHE_KEY));

    case "json":
      return await fetchJSONData();

    case "db":
      return await fetchDatabaseData();

    case "auto":
    default: {
      const cache = getCachedData(CACHE_KEY);

      if (cache) {
        return reshapeData(cache);
      }

      try {
        return await fetchJSONData();
      } catch {
        return await fetchDatabaseData();
      }
    }
  }
}

export default readData;