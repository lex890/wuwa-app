import { supabase } from "./supabase"
import { setCachedData, getCachedData } from "../utils/local"

async function getDatabaseId(name) {

  const { data, error } = await supabase
    .from("wuwa_characters")
    .select("id")
    .eq("name", name)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error)
    return null
  }

  return data.id
}

async function getTableData(id, table) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("main_id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error)
    return null
  }

  return data
}

async function getCharData(name) {

  try {
    const cached = getCachedData(`wuwa-${name}`)
    console.log(cached)
    if (cached) {
      const { tags, assets, abilities, skins } = cached || {}
      return {
        tags,
        assets,
        abilities,
        skins
      }
    }
    
    const id = await getDatabaseId(name);
    
    const [
      newCharacterTags,
      newCharacterAssets,
      newCharacterAbilities,
      newCharacterSkins
    ] = await Promise.all([
      getTableData(id, "character_tags"),
      getTableData(id, "character_assets"),
      getTableData(id, "character_abilities"),
      getTableData(id, "character_skins")
    ])

    setCachedData(
      {
        tags: newCharacterTags,
        assets: newCharacterAssets,
        abilities: newCharacterAbilities,
        skins: newCharacterSkins
      },
      `wuwa-${name}`
    )

    return {
      tags: newCharacterTags,
      assets: newCharacterAssets,
      abilities: newCharacterAbilities,
      skins: newCharacterSkins
    }

  } catch (error) {
    
    console.error(error)
    throw error
  }
}

export default getCharData