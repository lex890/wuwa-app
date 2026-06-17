import { supabase } from "./supabase"

async function updateRow(table, rows) {
  const updates = rows.map(row =>
    supabase
      .from(table)
      .update(row)
      .eq("id", row.id)
  );

  const results = await Promise.all(updates);

  return results;
}

export default updateRow