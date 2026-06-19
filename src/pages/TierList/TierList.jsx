import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import charactersData from "../../api/wuwa-data.json";
import "./TierList.css";

const QUALITY_ORDER = ["SSR", "SR", "R", "N", "UR", "SP"];
const TIER_ROWS = ["T0", "T0.5", "T1", "T1.5", "T2", "T3", "T4"];
const ROLE_COLUMNS = ["DPS", "HYBRID", "SUPPORT"];
const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='system-ui, sans-serif' font-size='24'%3ENo image%3C/text%3E%3C/svg%3E";

const qualitySort = (a, b) => {
  const aIndex = QUALITY_ORDER.indexOf(a.quality);
  const bIndex = QUALITY_ORDER.indexOf(b.quality);
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  return a.quality.localeCompare(b.quality);
};

function normalizeCharacter(character) {
  const get = (obj, ...keys) => {
    for (const k of keys) {
      if (!obj || k == null) continue;
      // support nested like "Name.Content"
      if (k.includes(".")) {
        const parts = k.split(".");
        let cur = obj;
        let ok = true;
        for (const p of parts) {
          if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
            cur = cur[p];
          } else {
            ok = false;
            break;
          }
        }
        if (ok && cur != null) return cur;
      } else if (Object.prototype.hasOwnProperty.call(obj, k)) {
        const v = obj[k];
        if (v != null && v !== "") return v;
      }
    }
    return undefined;
  };

  const normalizeUrl = (url) => {
    if (!url) return "";
    if (typeof url !== "string") return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `https://api.encore.moe${url}`;
    }
    return url;
  };

  // prefer common variations and nested skin preview
  let skins = character.Skins;
  if (typeof skins === "string") {
    try {
      skins = JSON.parse(skins);
    } catch (e) {
      skins = null;
    }
  }

  const source =
    get(character, "PreviewRoleCard", "Preview_Role_Card", "previewRoleCard", "preview_role_card") ||
    (skins && skins[0] && (skins[0].PreviewRoleCard || skins[0].previewRoleCard)) ||
    (character.Skins && character.Skins[0] && (character.Skins[0].PreviewRoleCard || character.Skins[0].previewRoleCard)) ||
    get(character, "RolePortrait", "rolePortrait", "role_portrait") ||
    get(character, "Card", "card") ||
    get(character, "RoleHeadIconLarge", "roleHeadIconLarge", "role_head_icon_large") ||
    get(character, "RoleHeadIcon", "roleHeadIcon", "role_head_icon");

  const elementIcon = get(character, "ElementIcon", "ElementIcon6", "elementIcon", "element_icon");

  return {
    id: get(character, "Id", "id") ?? get(character, "PropertyId"),
    name: get(character, "Name.Content", "Name.content", "name", "Name") ?? "Unknown",
    element: get(character, "ElementName", "elementName", "element") ?? "Unknown",
    elementIcon: normalizeUrl(elementIcon) || placeholderImage,
    weapon: get(character, "WeaponTypeName", "weaponTypeName", "weapon") ?? "Unknown",
    quality: get(character, "QualityName", "qualityName", "Quality", "quality") ?? "Unknown",
    priority: get(character, "Priority", "priority") ?? 0,
    tags: get(character, "Tags", "tags") || [],
    image: normalizeUrl(source) || placeholderImage,
    fallback: normalizeUrl(get(character, "RoleHeadIconLarge", "Card", "RoleHeadIcon", "roleHeadIconLarge", "card", "role_head_icon_large") || ""),
  };
}

export default function TierList({ data = [] }) {
  const [search, setSearch] = useState("");
  const [elementFilter, setElementFilter] = useState("All");
  const [qualityFilter, setQualityFilter] = useState("All");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const characters = useMemo(
    () =>
      (data.length ? data : charactersData)
        .map(normalizeCharacter)
        .sort(qualitySort)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [data]
  );

  // log missing images/names to help debug unknown entries
  useEffect(() => {
    try {
      const missing = characters.filter(
        (c) => !c.image || c.image === placeholderImage || !c.name || c.name === "Unknown"
      );
      if (missing.length) {
        console.warn("TierList: missing images/names for", missing.map((m) => ({ id: m.id, name: m.name, image: m.image })));
      }
    } catch (e) {
      console.error(e);
    }
  }, [characters]);

  // explicit mapping provided by user: normalize names to lower-case keys
  const nameKey = (n) => (n || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

  const explicitTierMap = useMemo(() => {
    const map = {};
    const add = (names, tier, col) => {
      names.forEach((n) => {
        const key = nameKey(n);
        if (!map[key]) {
          map[key] = [];
        }
        map[key].push({ tier, col });
      });
    };

    add(["aemeath", "hiyuki", "luuk herssen", "sigrika"], "T0", "DPS");
    add(["denia", "lupa", "lynae", "qiuyuan"], "T0", "HYBRID");
    add(["chisa", "mornye", "shorekeeper"], "T0", "SUPPORT");

    add(["augusta", "cartethyia", "galbrena", "iuno", "lucy", "phrolova"], "T0.5", "DPS");
    add(["ciaccona"], "T0.5", "HYBRID");
    add(["verina"], "T0.5", "SUPPORT");

    add(["carlotta"], "T1", "DPS");
    add(["iuno", "rebecca"], "T1", "HYBRID");
    add(["rover: aero", "rover aero"], "T1", "SUPPORT");

    add(["brant", "jiyan", "phoebe", "zani"], "T1.5", "DPS");
    add(["brant", "mortefi"], "T1.5", "HYBRID");
    add(["rover: spectro", "rover spectro"], "T1.5", "SUPPORT");

    add(["camellya", "encore", "jinhsi"], "T2", "DPS");
    add(["cantarella", "changli", "phoebe", "sanhua", "zhezhi"], "T2", "HYBRID");
    add(["buling"], "T2", "SUPPORT");

    add(["lingyang", "rover: havoc", "rover havoc", "xiangli yao"], "T3", "DPS");
    add(["danjin", "roccia", "yinlin"], "T3", "HYBRID");
    add(["baizhi"], "T3", "SUPPORT");

    add(["calcharo", "chixia"], "T4", "DPS");
    add(["aalto", "jianxin", "lumi", "taoqi", "yangyang"], "T4", "HYBRID");
    add(["youhu", "yuanwu"], "T4", "SUPPORT");

    return map;
  }, []);

  const elementOptions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(characters.map((character) => character.element))).sort(),
    ],
    [characters]
  );

  const qualityOptions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(characters.map((character) => character.quality))).sort((a, b) => {
        const aIndex = QUALITY_ORDER.indexOf(a);
        const bIndex = QUALITY_ORDER.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
      }),
    ],
    [characters]
  );

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();
    return characters.filter((char) => {
      if (elementFilter !== "All" && char.element !== elementFilter) return false;
      if (qualityFilter !== "All" && char.quality !== qualityFilter) return false;
      if (!query) return true;
      return [char.name, char.element, char.weapon, char.quality]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [characters, search, elementFilter, qualityFilter]);

  const getRoleColumn = (character) => {
    const tagText = character.tags.map((tag) => tag.TagName || "").join(" ").toLowerCase();
    const supportMatches = ["support", "healer", "regeneration", "survivability", "resonance liberation regeneration"];
    const dpsMatches = [
      "main damage",
      "damage dealer",
      "dmg",
      "heavy attack",
      "havoc",
      "spectro",
      "fusion",
      "aero",
      "glacio",
      "electro",
      "resonance skill",
      "basic attack",
      "echo skill",
    ];

    if (supportMatches.some((term) => tagText.includes(term))) {
      return "SUPPORT";
    }
    if (dpsMatches.some((term) => tagText.includes(term))) {
      return "DPS";
    }
    return "HYBRID";
  };

  const tierRows = useMemo(() => {
    const sorted = [...filteredCharacters].sort((a, b) => a.priority - b.priority);
    const rows = TIER_ROWS.reduce((acc, row) => {
      acc[row] = ROLE_COLUMNS.reduce((colAcc, col) => {
        colAcc[col] = [];
        return colAcc;
      }, {});
      return acc;
    }, {});

    sorted.forEach((character, index) => {
      const nk = nameKey(character.name);
      const explicit = explicitTierMap[nk];
      if (Array.isArray(explicit)) {
        explicit.forEach(({ tier, col }) => {
          if (TIER_ROWS.includes(tier) && ROLE_COLUMNS.includes(col)) {
            rows[tier][col].push(character);
          }
        });
        return;
      }
      // fallback distribution: fill tiers by groups of 8 (binocular viewport)
      const rowIndex = Math.min(Math.floor(index / 8), TIER_ROWS.length - 1);
      const row = TIER_ROWS[rowIndex];
      const column = getRoleColumn(character);
      rows[row][column].push(character);
    });
    return rows;
  }, [filteredCharacters]);

  const renderCard = (character) => {
    return (
      <article
        key={character.id}
        className="quality-card"
        onClick={() => setSelectedCharacter(character)}
      >
        <div className="quality-card-badge">
          <img
            src={character.elementIcon}
            alt={character.element}
            className="quality-card-element"
          />
          <span className="quality-card-quality">{character.quality}</span>
        </div>
        <button type="button" className="quality-image-button" aria-label={`View details for ${character.name}`}>
          <img
            src={character.image}
            alt={character.name}
            loading="lazy"
            onError={(event) => {
              if (character.fallback && event.currentTarget.src !== character.fallback) {
                event.currentTarget.src = character.fallback;
              } else {
                event.currentTarget.src = placeholderImage;
              }
            }}
          />
        </button>
      </article>
    );
  };

  // Display settings: binocular viewport shows 16 slots per tier (2 rows x 8 cols)
  const VISIBLE_SLOTS = 16;
  const ROWS = 2; // matches .quality-card-grid's 2 rows
  const visibleCols = Math.ceil(VISIBLE_SLOTS / ROWS); // 8 columns

  return (
    <main className="tierlist-page quality-tier-page">
      <header className="tierlist-header">
        <div>
          <h1>Wuthering Waves Quality Tier List</h1>
          <p>
            Browse characters grouped by quality. Use the filters to narrow the list and
            click a card to reveal more details.
          </p>
        </div>
        <div className="tierlist-controls">
          <Link className="back-link" to="/">
            ← Back to Admin
          </Link>
          <Link className="secondary-link" to="/tier-builder">
            Go to Tier Builder
          </Link>
        </div>
      </header>

      <section className="tierlist-toolbar">
        <div className="tierlist-filters">
          <label>
            Search:
            <input
              className="tierlist-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, element, weapon or quality"
            />
          </label>
          <label>
            Element:
            <select value={elementFilter} onChange={(event) => setElementFilter(event.target.value)}>
              {elementOptions.map((element) => (
                <option key={element} value={element}>
                  {element}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quality:
            <select value={qualityFilter} onChange={(event) => setQualityFilter(event.target.value)}>
              {qualityOptions.map((quality) => (
                <option key={quality} value={quality}>
                  {quality}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="tierlist-body">
        <div className="quality-list-area">
          <section className="quality-summary">
            <p>
              Showing {filteredCharacters.length} filtered characters across {TIER_ROWS.length} tiers and {ROLE_COLUMNS.length} role columns. Scroll horizontally inside each tier cell to view more.
            </p>
          </section>

          <section className="tier-matrix">
            <div className="tier-matrix-header">
              <div className="tier-row-label" />
              {ROLE_COLUMNS.map((column) => (
                <div key={column} className="tier-column-title">
                  {column}
                </div>
              ))}
            </div>
            {TIER_ROWS.map((tier) => (
              <div key={tier} className={`tier-row tier-row-${tier.toLowerCase().replace('.', '-')}`}>
                <div className="tier-row-label">
                  <span>{tier}</span>
                </div>
                {ROLE_COLUMNS.map((column) => {
                  const items = tierRows[tier][column];
                  const visibleCount = 8;
                  const CARD_W = 130;
                  const GAP = 10;
                  const railWidth = visibleCount * CARD_W + (visibleCount - 1) * GAP;
                  return (
                    <div key={column} className="tier-column">
                      <div className="tier-column-count">{items.length} chars</div>
                      <div className="quality-card-rail" style={{ maxWidth: `${railWidth}px` }}>
                        <div className="quality-card-grid">
                          {items.map((character) => renderCard(character))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
        </div>
      </section>

      {selectedCharacter && (
        <div className="tier-modal-overlay" onClick={() => setSelectedCharacter(null)}>
          <div className="tier-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="tier-modal-close"
              onClick={() => setSelectedCharacter(null)}
              aria-label="Close character details"
            >
              ×
            </button>
                <h2 className="tier-modal-title">{selectedCharacter.name}</h2>
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  loading="lazy"
                  className="tier-modal-image"
                  onError={(event) => {
                    if (
                      selectedCharacter.fallback &&
                      event.currentTarget.src !== selectedCharacter.fallback
                    ) {
                      event.currentTarget.src = selectedCharacter.fallback;
                    } else {
                      event.currentTarget.src = placeholderImage;
                    }
                  }}
                />
                <div className="tier-modal-details">
                  <p><strong>Quality:</strong> {selectedCharacter.quality}</p>
                  <p><strong>Element:</strong> {selectedCharacter.element}</p>
                  <p><strong>Weapon:</strong> {selectedCharacter.weapon}</p>
                </div>
          </div>
        </div>
      )}
    </main>
  );
}
