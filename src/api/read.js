import { supabase } from "./supabase";
import { getCachedData, setCachedData } from "../utils/local";

async function readData(forceRefresh = false) {
  console.log("forceRefresh:", forceRefresh)
  try {
    if (!forceRefresh) {
      const localChar = getCachedData("wuwa-character")
      const localWeapon = getCachedData("wuwa-weapon")
      const localEcho = getCachedData("wuwa-echo")

      if (localChar && localWeapon && localEcho) {
        return {
          characters: localChar.data,
          weapons: localWeapon.data,
          echoes: localEcho.data,
        }
      }
    }
    // I am fetching in the db
    const [
      { data: characters, error: cError },
      { data: weapons, error: wError },
      { data: echoes, error: eError },
    ] = await Promise.all([
      supabase.from("wuwa_characters").select("*"),
      supabase.from("wuwa_weapons").select("*"),
      supabase.from("wuwa_echoes").select("*"),
    ]);
    console.log(characters)
    if (!cError && characters?.length) {
      setCachedData(characters, "wuwa-character");
    }

    if (!wError && weapons?.length) {
      setCachedData(weapons, "wuwa-weapon");
    }

    if (!eError && echoes?.length) {
      setCachedData(echoes, "wuwa-echo");
    }

    return {
      characters: characters || [],
      weapons: weapons || [],
      echoes: echoes || [],
    };
  } catch (error) {
    console.error(error);

    return {
      characters: [],
      weapons: [],
      echoes: [],
    }
  }
}

export default readData