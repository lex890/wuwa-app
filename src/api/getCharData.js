import { supabase } from "./supabase"
import { setCachedData, getCachedData } from "../utils/local"

async function getDatabaseId(name) {
  const { data, error } = await supabase
    .from("wuwa_characters")
    .select("id")
    .eq("name", name)
    .single()

  if (error) {
    console.error(error)
    return null
  }
  console.log(data.id)
  return data.id
}

async function getTableData(id, table) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("main_id", id)
    .single()

  if (error) {
    console.error(error)
    return null
  }
  console.log(data)
  return data
}

async function getCharData(name) {
  try {
    const cached = getCachedData(`wuwa-${name}`)
    console.log(cached)
    if (cached) {
      const { tags, assets, abilities } = cached.data || {}

      return {
        tags,
        assets,
        abilities
      }
    }
    
    const id = await getDatabaseId(name);

    const [
      newCharacterTags,
      newCharacterAssets,
      newCharacterAbilities
    ] = await Promise.all([
      getTableData(id, "character_tags"),
      getTableData(id, "character_assets"),
      getTableData(id, "character_abilities")
    ])

    setCachedData(
      {
        tags: newCharacterTags,
        assets: newCharacterAssets,
        abilities: newCharacterAbilities,
      },
      `wuwa-${name}`
    )

    return {
      tags: newCharacterTags,
      assets: newCharacterAssets,
      abilities: newCharacterAbilities,
    }

  } catch (error) {
    
    console.error(error)
    throw error
  }
}

export default getCharData