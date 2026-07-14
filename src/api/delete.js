import { supabase } from "./supabase"

async function deleteRow(table, ids) {
  try {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    const { error } = await supabase
      .from(table)
      .delete()
      .in("id", idsArray)

    if (error) throw error

    
    
  } catch (error) {
    return error
  }
  return null
}

export default deleteRow