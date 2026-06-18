import { supabase } from "./supabase"

async function updateRow(table, row) {
  const { data, error } = await supabase
    .from(table)
    .update(row)
    .eq("id", row.id)
    .select()

  if (error) throw error

  return data
}

export default updateRow