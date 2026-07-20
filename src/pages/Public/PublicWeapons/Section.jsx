import WeaponCard from "./WeaponCard"

function WeaponSection({ title, data, icon }) {
  return(
    <div className="view-card" data-title={title}>
      <span>
        <div className="weapon-logo">
          <img src={icon} alt="" />
        </div>
        <div className="weapon-name">
          {title}
        </div>
      </span>
      {data.map(weapon => 
        <WeaponCard key={weapon.id} info={weapon}/>
      )}
    </div>
  )
}

export default WeaponSection