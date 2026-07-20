import { echoSets } from "@/constant/echoSets";
import { useEcho } from "@/hooks/Public/useEcho";

function Filter() {
  const { echo, toggleEcho } = useEcho()

  return (
    <section id="filter-section">
      <div className="flex-start-row">
        <span>Echo Sets</span>
        <Icons echo={echo} toggleEcho={toggleEcho} />
      </div>
    </section>
  );
}
export default Filter

const Icons = ({ echo, toggleEcho }) => {
  return(
    <div id="set-filters">
      {echoSets.map((set) => (
        <button
          key={set.id}
          className={`filter-button-echo ${
            echo.includes(set.name) ? "active" : ""
          }`}
          onClick={() => toggleEcho(set.name)}
        >
          <img src={set.icon} alt={set.name} />
          <span className="filter-label">{set.name}</span>
        </button>
      ))}
    </div>
  )
}