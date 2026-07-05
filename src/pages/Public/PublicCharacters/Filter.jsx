import { ElementIcons } from "@/assets/webp/constant/element_small"
import { RarityIcons } from "@/assets/webp/constant/rarity"
import { WeaponIcons } from "@/assets/webp/constant/weapon"
import Rarity from "@/components/Rarity"

function Filter() {
  return(
    <>
      <section id="filter-section"> 
        <div className="flex-start-row">
          <span>Element</span>
          {
            Object.entries(ElementIcons).map(([name, icons]) => {
              return(
                <button className="filter-button">
                  <img src={icons} alt={name} data-element={name}/>
                </button>
              )
            })
          }
        </div>

        <div className="flex-start-row">
          <span>Weapon</span>
          {
            Object.entries(WeaponIcons).map(([name, icons]) => {
              return(
                <button className="filter-button">
                  <img src={icons} alt={name} data-element={name}/>
                </button>
              )
            })
          }
        </div>

        <div className="flex-start-row">
          <span>Rarity</span>
          {
            Object.entries(RarityIcons).map(([name]) => {
              return(
                <button className="filter-button-long">
                  <Rarity star={name === "Five" ? 5 : 4} element={name}/>
                </button>
              )
            })
          }
        </div>
      </section>
    </>
  )
}

export default Filter