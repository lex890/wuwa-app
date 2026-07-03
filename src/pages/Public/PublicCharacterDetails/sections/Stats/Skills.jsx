

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
      <div className="section-card grid-whole">
        <div className="view-card character-skills">
          <h1>Skills</h1>
          {
            orderedSkills.map(([key, value])=>{
              return(
                <div className="section-card">
                  <div className="inner-view-card">
                    <div className="flex-start gap1">
                      <img src={value.Icon} alt="" />
                      <h3>{value.SkillName ?? ""}</h3>
                      <span>{value.SkillType}</span>
                    </div>
                    <div>{value.SkillDescribe}</div>
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