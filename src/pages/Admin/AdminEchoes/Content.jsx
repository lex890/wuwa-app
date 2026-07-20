import { useEcho } from "@/hooks/Admin/useEcho"
import Card from "./Card"

function Content() {
  const { filteredEchoes } = useEcho();

  return(
    <div id="echo-list">
      {filteredEchoes.map(echo => (
        <Card key={echo.id} data={echo} />
      ))}
    </div>
  )
}

export default Content