import { useMemo } from "react";

export function useWeaponType(data) {
  return useMemo(() => ({
    Broadblade: data.filter((w) => w.type_name === "Broadblade"),
    Sword: data.filter((w) => w.type_name === "Sword"),
    Gauntlets: data.filter((w) => w.type_name === "Gauntlets"),
    Pistols: data.filter((w) => w.type_name === "Pistols"),
    Rectifier: data.filter((w) => w.type_name === "Rectifier"),
  }), [data]);
}

export default useWeaponType