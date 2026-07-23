import StatRow from "./StatRow";

function StatDisplay({ stats, level }) {
  return(
    <>
      {Object.values(stats).map((stat, index) => (
        <StatRow key={index} stat={stat} level={level} index={index}/>
      ))}
    </>
  )
}

export default StatDisplay