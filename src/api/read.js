import { supabase } from "./supabase";
import { getCachedData, setCachedData } from "../utils/local";

function reshapeData(data = {}) {
  return {
    characters: data.characters ?? [],
    weapons: data.weapons ?? [],
    echoes: data.echoes ?? [],
  };
}

async function fetchDataBase() {
  console.log('fetching db data')
  const [
    { data: characters, error: cError },
    { data: weapons, error: wError },
    { data: echoes, error: eError },
  ] = await Promise.all([
    supabase.from("wuwa_characters").select("*"),
    supabase.from("wuwa_weapons").select("*"),
    supabase.from("wuwa_echoes").select("*"),
  ]);

  if (cError) throw cError;
  if (wError) throw wError;
  if (eError) throw eError;

  const data = reshapeData({
    characters,
    weapons,
    echoes,
  });

  setCachedData(data, "wuwa-data");
  console.log(data)
  return data;
}

async function fetchJSONData() {
  console.log("fetching json data");

  try {
    const characterRes = await fetch("src/json/wuwa-characters.json");
    console.log("Characters:", characterRes.status, characterRes.headers.get("content-type"));
    if (!characterRes.ok) throw new Error(`Characters: HTTP ${characterRes.status}`);
    const characters = await characterRes.json();

    const weaponRes = await fetch("src/json/wuwa-weapons.json");
    console.log("Weapons:", weaponRes.status, weaponRes.headers.get("content-type"));
    if (!weaponRes.ok) throw new Error(`Weapons: HTTP ${weaponRes.status}`);
    const weapons = await weaponRes.json();

    const echoRes = await fetch("src/json/wuwa-echoes.json");
    console.log("Echoes:", echoRes.status, echoRes.headers.get("content-type"));
    if (!echoRes.ok) throw new Error(`Echoes: HTTP ${echoRes.status}`);
    const echoes = await echoRes.json();

    const data = reshapeData({
      characters,
      weapons,
      echoes,
    });

    setCachedData(data, "wuwa-data");

    return data;
  } catch (error) {
    console.error("Failed to load local JSON data:", error);
    throw error;
  }
}

async function readData({ source = "auto" } = {}) {
  switch (source) {
    case "cache":
      return reshapeData(getCachedData("wuwa-data"));
    case "json":
      return await fetchJSONData();
    case "db":
      return await fetchDataBase();

    case "auto":
    default: {
      const cache = getCachedData("wuwa-data");

      if (cache) return reshapeData(cache);

      try {
        return await fetchJSONData();
      } catch {
        return await fetchDataBase();
      }
    }
  }
}
export default readData