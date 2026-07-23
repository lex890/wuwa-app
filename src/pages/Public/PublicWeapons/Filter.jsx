import { RarityIcons } from "@/assets/webp/constant/rarity"
import { WeaponIcons } from "@/assets/webp/constant/weapon"
import Rarity from "@/components/Rarity"

function Filter(props) {
  const {
    weapon,
    toggleWeapon,
    rarity,
    toggleRarity,
  } = props;

  return (
    <section id="filter-section">
      <div className="flex-start-row">
        <span>Weapon</span>

        {Object.entries(WeaponIcons).map(([name, icon]) => (
          <button
            key={name}
            className={`filter-button ${
              weapon.includes(name) ? "active" : ""
            }`}
            data-value={name}
            onClick={() => toggleWeapon(name)}
          >
            <img src={icon} alt={name} data-element={name} />
          </button>
        ))}
      </div>

      <div className="flex-start-row">
        <span>Rarity</span>
        <button
          key={3}
          className={`filter-button-long ${
            rarity.includes(Number(3)) ? "active" : ""
          }`}
          onClick={() => toggleRarity(Number(3))}
        > {console.log(3)}
          <Rarity star={3} element={3} />
        </button>
        {Object.entries(RarityIcons).map(([name]) => (
          <button
            key={name}
            className={`filter-button-long ${
              rarity.includes(Number(name)) ? "active" : ""
            }`}
            onClick={() => toggleRarity(Number(name))}
          > {console.log(name)}
            <Rarity star={name} element={name} />
          </button>
        ))}

      </div>
    </section>
  );
}

export default Filter