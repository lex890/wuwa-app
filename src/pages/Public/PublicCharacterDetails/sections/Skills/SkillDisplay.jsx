import SkillRow from "./SkillRow"

function SkillDisplay({ stats, level }) {

  return(
    <>
      {
        stats.map((stat, index) => (
          <SkillRow key={index} stat={stat} level={level} index={index}/>
          // <div>This is {stat.attributeName}, level {level}</div>
        ))
      }
    </>
  )
}

export default SkillDisplay