import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import charactersData from "../../api/wuwa-data.json";
import "./TierBuilder.css";

const TIERS = ["S", "A", "B", "C", "D"];
const TIER_LABELS = {
  S: "Best",
  A: "Great",
  B: "Good",
  C: "Average",
  D: "Low",
};

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='system-ui, sans-serif' font-size='24'%3ENo image%3C/text%3E%3C/svg%3E";

function normalizeCharacter(character) {
  const source =
    character.RolePortrait || character.Card || character.RoleHeadIconLarge || character.RoleHeadIcon || "";

  const normalizeUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `https://api.encore.moe${url}`;
    }
    return url;
  };

  return {
    id: character.Id,
    name: character.Name?.Content ?? "Unknown",
    element: character.ElementName ?? "Unknown",
    weapon: character.WeaponTypeName ?? "Unknown",
    quality: character.QualityName ?? "Unknown",
    image: normalizeUrl(source) || PLACEHOLDER_IMAGE,
    fallback: normalizeUrl(character.RoleHeadIconLarge || character.Card || character.RoleHeadIcon || ""),
  };
}

export default function TierBuilder() {
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState("");
  const [elementFilter, setElementFilter] = useState("All");
  const [qualityFilter, setQualityFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const characters = useMemo(
    () =>
      charactersData
        .map(normalizeCharacter)
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

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
      ...Array.from(new Set(characters.map((character) => character.quality))).sort(),
    ],
    [characters]
  );

  useEffect(() => {
    const saved = localStorage.getItem("tier-builder-assignments");
    if (saved) {
      try {
        setAssignments(JSON.parse(saved));
      } catch {
        setAssignments({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tier-builder-assignments", JSON.stringify(assignments));
  }, [assignments]);

  const visibleCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();
    return characters.filter((char) => {
      if (elementFilter !== "All" && char.element !== elementFilter) {
        return false;
      }
      if (qualityFilter !== "All" && char.quality !== qualityFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      return [char.name, char.element, char.weapon, char.quality]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [characters, search, elementFilter, qualityFilter]);

  const unassignedCharacters = useMemo(
    () =>
      visibleCharacters.filter(
        (character) => !assignments[character.id] || assignments[character.id] === "Unassigned"
      ),
    [visibleCharacters, assignments]
  );

  const tierCharacters = useMemo(() => {
    return TIERS.reduce((map, tier) => {
      map[tier] = visibleCharacters.filter((character) => assignments[character.id] === tier);
      return map;
    }, {});
  }, [assignments, visibleCharacters]);

  const assignTier = (characterId, tier) => {
    setAssignments((current) => ({
      ...current,
      [characterId]: tier,
    }));
  };

  const resetAll = () => {
    if (
      window.confirm(
        "Reset all tier assignments? This will clear your current tier list."
      )
    ) {
      setAssignments({});
      setExpandedId(null);
    }
  };

  const handleExport = () => {
    const payload = {
      assignments,
      exportedAt: new Date().toISOString(),
    };
    const jsonBlob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tier-builder-assignments.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(assignments, null, 2));
      window.alert("Tier assignments copied to clipboard.");
    } catch {
      window.prompt(
        "Copy your tier assignments JSON:",
        JSON.stringify(assignments, null, 2)
      );
    }
  };

  const handleImport = () => {
    const text = window.prompt("Paste tier assignments JSON here:");
    if (!text) return;
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        setAssignments(parsed.assignments ?? parsed);
      }
    } catch (error) {
      window.alert("Invalid JSON. Please paste valid tier assignment data.");
    }
  };

  const handleDrop = (event, tier) => {
    event.preventDefault();
    event.stopPropagation();
    const id = Number(event.dataTransfer.getData("application/tier-item"));
    if (!Number.isNaN(id)) {
      assignTier(id, tier);
      setExpandedId(null);
      setDragTarget(null);
    }
  };

  const handleDragStart = (event, characterId) => {
    event.dataTransfer.setData("application/tier-item", String(characterId));
    event.dataTransfer.setData("text/plain", String(characterId));
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (event, tier) => {
    event.preventDefault();
    setDragTarget(tier);
  };

  const handleDragLeave = () => {
    setDragTarget(null);
  };

  const toggleDetails = (characterId) => {
    setExpandedId((current) => (current === characterId ? null : characterId));
  };

  const renderCard = (character, tier) => {
    const expanded = expandedId === character.id;
    return (
      <article
        key={character.id}
        draggable
        onDragStart={(event) => handleDragStart(event, character.id)}
        className="character-card"
      >
        <button
          type="button"
          className="character-image-button"
          onClick={() => toggleDetails(character.id)}
          draggable
          onDragStart={(event) => handleDragStart(event, character.id)}
        >
          <img
            src={character.image}
            alt={character.name}
            loading="lazy"
            onError={(event) => {
              if (character.fallback && event.currentTarget.src !== character.fallback) {
                event.currentTarget.src = character.fallback;
              } else {
                event.currentTarget.src = PLACEHOLDER_IMAGE;
              }
            }}
          />
        </button>
        <div className="character-card-body">
          <div className="character-tag">
            <div>
              <h2>{character.name}</h2>
              <span className="status-badge">{character.quality}</span>
            </div>
            <span className="character-tier-label">{tier || "Unassigned"}</span>
          </div>
          <div className="character-meta">
            <span>{character.element}</span>
            <span>{character.weapon}</span>
          </div>
          {expanded && (
            <div className="character-details">
              <p>Character ID: {character.id}</p>
              <p>Element: {character.element}</p>
              <p>Weapon: {character.weapon}</p>
              <p>Quality: {character.quality}</p>
              <p className="character-instructions">
                Drag this card into a tier column to assign it.
              </p>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <main className="tierlist-page tier-builder-page">
      <header className="tierlist-header">
        <div>
          <h1>Build Your Own Tier List</h1>
          <p>
            Drag cards into tiers to create a custom Wuthering Waves ranking.
            Click a character image to reveal more details.
          </p>
        </div>
        <div className="tierlist-controls">
          <Link className="back-link" to="/">
            ← Back to Admin
          </Link>
          <Link className="back-link" to="/tier-list">
            Quality Tier List
          </Link>
          <button className="tierlist-reset" type="button" onClick={resetAll}>
            Reset Builder
          </button>
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
              placeholder="Character, element, weapon, quality"
            />
          </label>
          <label>
            Element:
            <select
              value={elementFilter}
              onChange={(event) => setElementFilter(event.target.value)}
            >
              {elementOptions.map((element) => (
                <option key={element} value={element}>
                  {element}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quality:
            <select
              value={qualityFilter}
              onChange={(event) => setQualityFilter(event.target.value)}
            >
              {qualityOptions.map((quality) => (
                <option key={quality} value={quality}>
                  {quality}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="tierlist-export-buttons">
          <button type="button" onClick={handleExport}>
            Export JSON
          </button>
          <button type="button" onClick={handleCopyJSON}>
            Copy JSON
          </button>
          <button type="button" onClick={handleImport}>
            Import JSON
          </button>
        </div>
      </section>

      <section className="unassigned-section">
        <div className="unassigned-header">
          <div>
            <h2>Unassigned</h2>
            <p>Drag a character into a tier below to assign them.</p>
          </div>
          <span className="unassigned-count">{unassignedCharacters.length}</span>
        </div>
        <div
          className={`unassigned-grid ${dragTarget === "Unassigned" ? "drop-active" : ""}`}
          onDragOver={(event) => event.preventDefault()}
          onDragEnter={(event) => handleDragEnter(event, "Unassigned")}
          onDragLeave={handleDragLeave}
          onDrop={(event) => handleDrop(event, "Unassigned")}
        >
          {unassignedCharacters.map((character) => renderCard(character, null))}
        </div>
      </section>

      <section className="tier-columns-header">
        {TIERS.map((tier) => (
          <div key={tier} className="tier-column-header">
            <span className="tier-code">{tier}</span>
            <span className="tier-label">{TIER_LABELS[tier]}</span>
            <span className="tier-count">{tierCharacters[tier]?.length} cards</span>
          </div>
        ))}
      </section>

      <section className="tier-columns">
        {TIERS.map((tier) => (
          <div
            key={tier}
            className={`tier-column ${dragTarget === tier ? "drop-active" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDragEnter={(event) => handleDragEnter(event, tier)}
            onDragLeave={handleDragLeave}
            onDrop={(event) => handleDrop(event, tier)}
          >
            <div className="tier-title">
              <div>
                <span className="tier-code">{tier}</span>
                <span className="tier-label">{TIER_LABELS[tier]}</span>
              </div>
              <span className="tier-count">{tierCharacters[tier]?.length}</span>
            </div>
            <div className="tier-dropzone">
              {tierCharacters[tier]?.length ? (
                tierCharacters[tier].map((character) => renderCard(character, tier))
              ) : (
                <div className="empty-state">
                  Drop cards here to assign them to {tier} tier.
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="tierlist-summary">
        <p>
          Use the filters to narrow characters, and drag cards into each tier to build
          your Wuthering Waves ranking.
        </p>
      </section>
    </main>
  );
}
