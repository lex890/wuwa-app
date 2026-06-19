import { supabase } from "./supabase"

async function updateRow(table, rows) {
  const updates = (Array.isArray(rows) ? rows : [rows]).map(row =>
    supabase
      .from(table)
      .update(row)
      .eq("id", row.id)
      .select()
  )

  const results = await Promise.all(updates)

  return results
}

export default updateRow