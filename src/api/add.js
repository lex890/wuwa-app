import { supabase } from "./supabase"

async function addRow(table, rows) {
  try {
    const rowsArray = Array.isArray(rows) ? rows : [rows]

    const { error } = await supabase
      .from(table)
      .insert(rowsArray)

    if (error) throw error
    
    return null;
  } catch (error) {
    return error
  }
}

export default addRow