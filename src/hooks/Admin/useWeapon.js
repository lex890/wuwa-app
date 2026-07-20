import { useContext } from "react";
import { WeaponFilterContext } from "@/pages/Admin/AdminWeapons/WeaponsFilterProvider";

export function useWeapon() {
  const context = useContext(WeaponFilterContext);

  if (!context) {
    throw new Error(
      "useWeaponFilters must be used within EchoFilterProvider"
    );
  }

  return context;
}