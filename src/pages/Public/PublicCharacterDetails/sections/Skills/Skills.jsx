import SkillDescription from "./SkillDescription";
import SkillNumbers from "./SkillNumbers";
import reOrderData from "./reorder";

function Skills({ skills }) {

  const orderedSkills = reOrderData(skills)
  return(
    <>
      <div className="section-card grid-whole  margin-top">
        <div className="view-card character-skills">
          <h1>Skills</h1>
          {
            orderedSkills.map(([, value])=>{
              return(
                <div className="section-card">
                  <div className="">
                    <div className="skill-header flex-start gap1">
                      <img src={value.Icon} alt="" />
                      <h3>{value.SkillName ?? ""}</h3>
                      <span>{value.SkillType}</span>
                    </div>
                    <div className="skill-desc flex-center inner-view-card">
                      <SkillDescription text={value.SkillDescribe}/>
                      <SkillNumbers attributes={value.SkillAttributes}/>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div> 
      </div>
    </>
  )
}

export default Skills 