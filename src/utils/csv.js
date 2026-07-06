import fs from "fs";

const json = JSON.parse(fs.readFileSync("./src/api/wuwa-echoes.json", "utf-8"));

// flatten if needed
const flat = json.map(item => ({
  id: item.Id,
  name: item.Name,
  icon_url: item.Icon,
  quality: item.Rarity,
  element: item.Element.Name,
  element_icon_url: item.Element.Icon,
  sets: JSON.stringify(item.FetterGroups ?? [])
}));

const headers = Object.keys(flat[0]).join(",");

const rows = flat.map(obj =>
  Object.values(obj)
    .map(v => `"${String(v).replace(/"/g, '""')}"`)
    .join(",")
);

const csv = [headers, ...rows].join("\n");

fs.writeFileSync("data.csv", csv);
