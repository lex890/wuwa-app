import SkillDescription from "./SkillDescription";
import SkillNumbers from "./SkillNumbers";

function Skills({ skills }) {

  const reOrderData = () => {
    const skillOrder = [
      "normal",
      "skill",
      "liberation",
      "inherent_1",
      "inherent_2",
      "intro",
      "forte",
      "inherent_3",
      "outro",
      "tune"
    ];

    return Object.entries(skills).sort(([keyA], [keyB]) => {
      return skillOrder.indexOf(keyA) - skillOrder.indexOf(keyB);
    });
  }

  const orderedSkills = reOrderData()

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