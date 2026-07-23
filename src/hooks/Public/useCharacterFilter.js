// hooks/useCharacterFilters.js
import { useMemo, useState } from "react";

export function useCharacterFilters(characters) {
  const [element, setElement] = useState([]);
  const [weapon, setWeapon] = useState([]);
  const [rarity, setRarity] = useState([]);
  const [search, setSearch] = useState("");

  const toggle = (setter) => (value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      const stringSearch = search.toLowerCase();

      const matchesSearch =
        char.id.toString().includes(stringSearch) ||
        char.name?.toLowerCase().includes(stringSearch) ||
        char.elemen_type?.toLowerCase().includes(stringSearch) ||
        char.weapon_type?.toLowerCase().includes(stringSearch);

      const matchesElement =
        element.length === 0 || element.includes(char.elemen_type);

      const matchesWeapon =
        weapon.length === 0 || weapon.includes(char.weapon_type);

      const matchesRarity =
        rarity.length === 0 || rarity.includes(char.quality_id);

      return (
        matchesSearch &&
        matchesElement &&
        matchesWeapon &&
        matchesRarity
      );
    });
  }, [characters, search, element, weapon, rarity]);

  return {
    filteredCharacters,

    search,
    setSearch,

    element,
    weapon,
    rarity,

    toggleElement: toggle(setElement),
    toggleWeapon: toggle(setWeapon),
    toggleRarity: toggle(setRarity),
  };
}