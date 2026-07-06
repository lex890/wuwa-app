import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function loadEnvFile(filename) {
  try {
    const content = await readFile(path.join(rootDir, filename), "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;

      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function toRow(character) {
  return {
    id: character.Id,
    name: character.Name?.Content ?? `Character ${character.Id}`,
    nickname: character.NickName?.Content ?? null,
    quality_id: character.QualityId ?? null,
    element_id: character.ElementId ?? null,
    weapon_type: character.WeaponType ?? null,
    payload: character,
    updated_at: new Date().toISOString(),
  };
}

async function main() {
  await loadEnvFile(".env.local");

  const tableName = process.env.SUPABASE_WUWA_TABLE ?? "wuwa-data";
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  const dataPath = path.join(rootDir, "src", "api", "wuwa-data.json");
  const characters = JSON.parse(await readFile(dataPath, "utf8"));

  if (!Array.isArray(characters)) {
    throw new Error("Expected src/api/wuwa-data.json to contain a JSON array.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const rows = characters.map(toRow);
  const chunkSize = 100;
  let imported = 0;

  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize);
    const { error } = await supabase
      .from(tableName)
      .upsert(chunk, { onConflict: "id" });

    if (error) {
      throw error;
    }

    imported += chunk.length;
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
