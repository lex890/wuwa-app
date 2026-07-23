import useWeaponType from "@/hooks/Public/useWeaponType"
import WeaponSection from "./Section"
import { WeaponIcons } from "@/assets/webp/constant/weapon";

function Content({ data }) {
  const {
    Broadblade,
    Sword,
    Gauntlets,
    Pistols,
    Rectifier,
  } = useWeaponType(data);
  
  console.log()

  return (
    <div id="card-container">
      {Broadblade.length > 0 && (
        <WeaponSection 
          title="Broadblade" 
          data={Broadblade}
          icon={WeaponIcons["Broadblade"]} 
        />
      )}

      {Sword.length > 0 && (
        <WeaponSection 
          title="Sword" 
          data={Sword}
          icon={WeaponIcons["Sword"]}
       />
      )}

      {Gauntlets.length > 0 && (
        <WeaponSection 
          title="Gauntlets" 
          data={Gauntlets}
          icon={WeaponIcons["Gauntlets"]} 
        />
      )}

      {Pistols.length > 0 && (
        <WeaponSection 
          title="Pistols" 
          data={Pistols} 
          icon={WeaponIcons["Pistols"]} 
        />
      )}

      {Rectifier.length > 0 && (
        <WeaponSection 
          title="Rectifier" 
          data={Rectifier} 
          icon={WeaponIcons["Rectifier"]} 
        />
      )}
    </div>
  );
}

export default Content