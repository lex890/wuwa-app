import "dotenv/config";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";

// ignore ES-Lint 
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function exportTable(table, file) {
  const { data, error } = await supabase
    .from(table)
    .select("*");

  if (error) throw error;

  await fs.writeFile(
    file,
    JSON.stringify(data, null, 2)
  );

  console.log(`✓ Exported ${table}: total ${data.length} records`);
}

async function main() {
  await exportTable(
    "wuwa_characters",
    "./public/wuwa-characters.json"
  );

  await exportTable(
    "wuwa_weapons",
    "./public/wuwa-weapons.json"
  );

  await exportTable(
    "wuwa_echoes",
    "./public/wuwa-echoes.json"
  );
}

main().catch(console.error);