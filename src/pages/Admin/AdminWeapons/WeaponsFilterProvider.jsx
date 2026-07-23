import { createContext } from "react";
import { useWeaponFilters } from "@/hooks/Public/useWeaponFilter";

export const WeaponFilterContext = createContext(null);

export function WeaponFilterProvider(
  { 
    children, 
    data, 
    loadData 
  }) {
    const filters = useWeaponFilters(data) 
    // make controller hook instead of just filter, add the loadData for force refresh based on useCharacterController.js
    console.log(filters)
    return(
      <WeaponFilterContext.Provider value={filters}>
        {children}
      </WeaponFilterContext.Provider>
    )
}
