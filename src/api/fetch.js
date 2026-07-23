import { supabase } from "./supabase"

async function fetchTable( table ) {

  const { data, error } = await supabase
    .from(table)
    .select("*");

  return { data, error };
}

export default fetchTable 
