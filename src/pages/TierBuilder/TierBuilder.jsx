import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import charactersData from "../../api/wuwa-data.json";
import { supabase } from "../../api/supabase";
import "./TierBuilder.css";

const TIERS = ["T0", "T0.5", "T1", "T1.5", "T2", "T3", "T4"];
const TIER_LABELS = {
  T0: "Top",
  "T0.5": "High",
  T1: "Strong",
  "T1.5": "Solid",
  T2: "Average",
  T3: "Low",
  T4: "Very Low",
};

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%231e293b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ccircle cx='200' cy='130' r='72' fill='rgba(170,59,255,0.18)'/%3E%3Cpath d='M132 230c20-42 49-63 68-63s48 21 68 63' fill='none' stroke='rgba(255,255,255,0.22)' stroke-width='18' stroke-linecap='round'/%3E%3C/svg%3E";

const normalizeText = (value) => {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (typeof value === "object") {
    if (typeof value.Content === "string" && value.Content.trim()) return value.Content.trim();
    if (typeof value.content === "string" && value.content.trim()) return value.content.trim();
    if (typeof value.Name === "string" && value.Name.trim()) return value.Name.trim();
  }
  return undefined;
};

function normalizeCharacter(character) {
  const get = (obj, ...keys) => {
    for (const k of keys) {
      if (!obj || k == null) continue;
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
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `https://api.encore.moe${url}`;
    return url;
  };

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

  return {
    id: get(character, "Id", "id") ?? get(character, "PropertyId"),
    name: normalizeText(get(character, "Name.Content", "Name.content", "name", "Name", "CharacterName")) ?? "Unknown",
    element: normalizeText(get(character, "ElementName", "elementName", "element")) ?? "Unknown",
    weapon: normalizeText(get(character, "WeaponTypeName", "weaponTypeName", "weapon")) ?? "Unknown",
    quality: normalizeText(get(character, "QualityName", "qualityName", "Quality", "quality")) ?? "Unknown",
    image: normalizeUrl(source) || PLACEHOLDER_IMAGE,
    fallback: normalizeUrl(get(character, "RoleHeadIconLarge", "Card", "RoleHeadIcon", "roleHeadIconLarge", "card", "role_head_icon_large") || ""),
  };
}

export default function TierBuilder({ data = [] }) {
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState("");
  const [elementFilter, setElementFilter] = useState("All");
  const [qualityFilter, setQualityFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("sign-in");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const characters = useMemo(() => {
    const sourceArr = data.length ? data : charactersData;
    const localById = new Map();
    const localByNameKey = new Map();
    charactersData.forEach((c) => {
      const key = (c.Name && c.Name.Content ? c.Name.Content : c.Name || c.name || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
      localByNameKey.set(key, c);
      if (c.Id) localById.set(String(c.Id), c);
      if (c.id) localById.set(String(c.id), c);
    });

    const mapped = sourceArr.map((raw) => {
      const n = normalizeCharacter(raw);
      const isPlaceholder = !n.image || n.image === PLACEHOLDER_IMAGE;
      const local = localById.get(String(n.id)) || localByNameKey.get((n.name || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").trim());
      if (local) {
        const localImage =
          local.PreviewRoleCard || local.RolePortrait || local.Card || (local.Skins && local.Skins[0] && (local.Skins[0].PreviewRoleCard || local.Skins[0].previewRoleCard)) || local.RoleHeadIconLarge || local.RoleHeadIcon || "";
        if (isPlaceholder && localImage) {
          n.image = localImage;
          n.fallback = local.RoleHeadIconLarge || local.Card || local.RoleHeadIcon || n.fallback;
        }
        if (n.name === "Unknown") {
          n.name = normalizeText(local.Name?.Content || local.name || local.Name) || n.name;
        }
        if (n.element === "Unknown") {
          n.element = normalizeText(local.ElementName || local.elementName || local.element) || n.element;
        }
        if (n.weapon === "Unknown") {
          n.weapon = normalizeText(local.WeaponTypeName || local.weaponTypeName || local.weapon) || n.weapon;
        }
        if (n.quality === "Unknown") {
          n.quality = normalizeText(local.QualityName || local.qualityName || local.Quality || local.quality) || n.quality;
        }
      }
      return n;
    });

    return mapped.sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  useEffect(() => {
    try {
      const missing = characters.filter(
        (c) => !c.image || c.image === PLACEHOLDER_IMAGE || !c.name || c.name === "Unknown"
      );
      if (missing.length) {
        console.warn("TierBuilder: missing images/names for", missing.map((m) => ({ id: m.id, name: m.name, image: m.image })));
      }
    } catch (e) {
      console.error(e);
    }
  }, [characters]);

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

  const loadSavedTierList = async (currentUser) => {
    if (!supabase || !currentUser?.id) return;

    try {
      const { data, error } = await supabase
        .from("tier_lists")
        .select("assignments")
        .eq("user_id", currentUser.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data?.assignments && typeof data.assignments === "object") {
        setAssignments(data.assignments);
        setSaveStatus("Loaded your saved tier list.");
      }
    } catch (error) {
      console.warn("Unable to load saved tier list:", error);
    }
  };

  const persistTierList = async (currentUser = user) => {
    if (!supabase) {
      setSaveStatus("Account saving is unavailable because Supabase is not configured.");
      return;
    }

    if (!currentUser?.id) {
      setAuthModalOpen(true);
      setAuthMode("sign-in");
      setAuthMessage("Create an account or sign in to save your tier list.");
      return;
    }

    setAuthLoading(true);
    setSaveStatus("Saving tier list...");

    try {
      const { data: existingRow, error: selectError } = await supabase
        .from("tier_lists")
        .select("id")
        .eq("user_id", currentUser.id)
        .limit(1)
        .maybeSingle();

      if (selectError && selectError.code !== "PGRST116") {
        throw selectError;
      }

      const payload = {
        user_id: currentUser.id,
        assignments,
        updated_at: new Date().toISOString(),
      };

      if (existingRow) {
        const { error } = await supabase
          .from("tier_lists")
          .update({ assignments: payload.assignments, updated_at: payload.updated_at })
          .eq("id", existingRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tier_lists").insert(payload);
        if (error) throw error;
      }

      setSaveStatus("Tier list saved to your account.");
      setAuthMessage("");
      setAuthModalOpen(false);
    } catch (error) {
      console.error("TierBuilder save failed", error);
      setSaveStatus(error?.message || "Could not save your tier list to your account right now.");
    } finally {
      setAuthLoading(false);
    }
  };

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

  useEffect(() => {
    if (!supabase) {
      setSaveStatus("Account saving is unavailable because Supabase is not configured.");
      return;
    }

    let active = true;

    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await loadSavedTierList(currentUser);
      }
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadSavedTierList(currentUser);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

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

  const handleSaveTierList = () => {
    if (!user) {
      setAuthModalOpen(true);
      setAuthMode("sign-in");
      setAuthMessage("Create an account or sign in to save your tier list.");
      return;
    }

    persistTierList(user);
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    if (!supabase) {
      setAuthMessage("Supabase is not configured for account saving.");
      return;
    }

    if (!authEmail.trim() || !authPassword) {
      setAuthMessage("Please enter both an email and a password.");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");

    try {
      const authResponse =
        authMode === "sign-up"
          ? await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword })
          : await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });

      if (authResponse.error) {
        throw authResponse.error;
      }

      const nextUser = authResponse.data.user ?? authResponse.data.session?.user ?? null;
      if (nextUser) {
        setUser(nextUser);
        setAuthEmail("");
        setAuthPassword("");
        await persistTierList(nextUser);
      } else {
        setAuthMessage(
          authMode === "sign-up"
            ? "Account created. Please confirm your email if required before saving."
            : "Signed in successfully."
        );
      }
    } catch (error) {
      setAuthMessage(error?.message || "Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSaveStatus("Signed out.");
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

  const renderCard = (character, tier, idx) => {
    const expanded = expandedId === character.id;
    return (
      <article
        key={`${character.id}-${character.name}-${idx}`}
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
            {tier ? <span className="character-tier-label">{tier}</span> : null}
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
          {user ? (
            <button className="tierlist-save-button" type="button" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : null}
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
          <button className="tierlist-save-button" type="button" onClick={handleSaveTierList}>
            {authLoading ? "Saving..." : user ? "Save Tier List" : "Save Tier List"}
          </button>
        </div>
        {saveStatus ? <p className="tier-save-status">{saveStatus}</p> : null}
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
          {unassignedCharacters.map((character, idx) => renderCard(character, null, idx))}
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
              {tierCharacters[tier]?.length
                ? tierCharacters[tier].map((character, idx) => renderCard(character, tier, idx))
                : null}
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

      {authModalOpen ? (
        <div className="tier-auth-modal-overlay" onClick={() => setAuthModalOpen(false)}>
          <div className="tier-auth-modal" onClick={(event) => event.stopPropagation()}>
            <div className="tier-auth-header">
              <h3>{authMode === "sign-in" ? "Sign in to save" : "Create an account"}</h3>
              <button type="button" className="tier-auth-close" onClick={() => setAuthModalOpen(false)}>
                ×
              </button>
            </div>
            <p>
              {authMode === "sign-in"
                ? "Sign in with an existing account to save your tier list."
                : "Create a new account so your tier list is saved securely to your profile."}
            </p>
            <form className="tier-auth-form" onSubmit={handleAuthSubmit}>
              <label>
                Email
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                />
              </label>
              {authMessage ? <p className="tier-auth-message">{authMessage}</p> : null}
              <div className="tier-auth-actions">
                <button type="submit" className="tierlist-save-button" disabled={authLoading}>
                  {authLoading ? "Working..." : authMode === "sign-in" ? "Sign In" : "Create Account"}
                </button>
                <button
                  type="button"
                  className="tier-auth-switch"
                  onClick={() => setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in")}
                >
                  {authMode === "sign-in" ? "Need an account?" : "Already have one?"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
