import { useWeapon } from "@/hooks/Admin/useWeapon";
import Card from "./Card"

function Content() {
  const { filteredWeapons } = useWeapon();
  return(
    <div id="echo-list">
      {filteredWeapons.map(echo => (
        <Card key={echo.id} data={echo} />
      ))}
    </div>
  )
}

export default Content