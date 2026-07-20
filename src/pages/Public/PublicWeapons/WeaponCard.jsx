import { Icon } from "lucide-react"

function WeaponCard({ info }) {
  return(
    <div className="w-card">
      <div>
        <img src={info.icon_url} alt="" />
      </div>
      <div>
        <div>{info.name}</div>
        <div>✮{info.rarity} | {info.type_name}</div>
      </div>
    </div>
  )
}

export default WeaponCard