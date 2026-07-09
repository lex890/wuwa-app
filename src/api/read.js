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
  console.log('fetching json data')
  try {
    const [characters, weapons, echoes] = await Promise.all([
      fetch("./src/json/wuwa-characters.json").then((res) => {
        console.log(res.status)
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }),
      fetch("/src/json/wuwa-weapons.json").then((res) => {
        console.log(res.status)
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }),
      fetch("/src/json/wuwa-echoes.json").then((res) => {
        console.log(res.json)
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }),
    ]);
    const data = reshapeData({
      characters,
      weapons,
      echoes,
    });
    setCachedData(data, "wuwa-data");
    return data
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