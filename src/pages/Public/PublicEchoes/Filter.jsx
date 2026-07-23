import { echoSets } from "@/constant/echoSets";
import { useEcho } from "@/hooks/Public/useEcho";

function Filter() {
  const { 
    echoSet, 
    toggleEchoSet 
  } = useEcho()

  return (
    <section id="filter-section">
      <div className="flex-start-row">
        <span>Echo Sets</span>
        <Icons echoSet={echoSet} toggle={toggleEchoSet} />
      </div>
    </section>
  );
}
export default Filter

const Icons = ({ echoSet, toggle }) => {
  return(
    <div id="set-filters">
      {echoSets.map((set) => (
        <button
          key={set.id}
          className={`filter-button-echo ${
            echoSet.includes(set.name) ? "active" : ""
          }`}
          onClick={() => toggle(set.name)}
        >
          <img src={set.icon} alt={set.name} />
          <span className="filter-label">{set.name}</span>
        </button>
      ))}
    </div>
  )
}