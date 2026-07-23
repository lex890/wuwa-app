import { useEcho } from "@/hooks/Public/useEcho"
import useEchoType from "@/hooks/Public/useEchoType"
import Section from "./Section"

function Content() {
  const { echoSet, filteredEchoes } = useEcho()
  const setGroups = useEchoType(echoSet, filteredEchoes)
  console.log(setGroups)
  return(
    <div id="card-container">
      {setGroups.map((set => {
        
        return(
          <Section
            key={set.id}
            icon={set.icon}
            name={set.name}
            value={set.echoes}
          />
        )
      })
        
      

      )}
    </div>
  ) 
}

export default Content