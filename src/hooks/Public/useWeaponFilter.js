import { useMemo, useState } from "react";

export function useWeaponFilters(weapons) {
  
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

  const filteredWeapons = useMemo(() => {
    const stringSearch = search.toLowerCase();

    return weapons.filter((weaponItem) => {
      const matchesSearch =
        weaponItem.id.toString().includes(stringSearch) ||
        weaponItem.name?.toLowerCase().includes(stringSearch) ||
        weaponItem.weapon_type?.toLowerCase().includes(stringSearch);

      const matchesWeapon =
        weapon.length === 0 || weapon.includes(weaponItem.type_name);

      const matchesRarity =
        rarity.length === 0 || rarity.includes(weaponItem.rarity);

      return (
        matchesSearch &&
        matchesWeapon &&
        matchesRarity
      );
    });
  }, [weapons, search, weapon, rarity]);

  return {
    filteredWeapons,
    itemCount: filteredWeapons.length,

    search,
    setSearch,

    weapon,
    rarity,

    toggleWeapon: toggle(setWeapon),
    toggleRarity: toggle(setRarity),
  };
}