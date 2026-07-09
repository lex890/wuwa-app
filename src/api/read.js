import { supabase } from "./supabase";
import { getCachedData, setCachedData } from "../utils/local";

async function readData(forceRefresh = false) {
  if (!forceRefresh) {
    const cache = getCachedData("wuwa-data");
    if (cache) return cache;
  }

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

  const data = {
    characters: characters ?? [],
    weapons: weapons ?? [],
    echoes: echoes ?? [],
  };

  setCachedData(data, "wuwa-data");
  console.log(data)
  return data;
}
export default readData