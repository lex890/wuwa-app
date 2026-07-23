import { supabase } from "./supabase"

async function addRow(table, rows) {
  const rowsArray = Array.isArray(rows) ? rows : [rows];

  const { data, error } = await supabase
    .from(table)
    .insert(rowsArray)
    .select();
  if (!error) console.log('data has been added: ', data)
  return { error };
}

export default addRow