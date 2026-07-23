import processText from "@/utils/textParser"

function SkillDescription({ text }) {
  const textDesc = processText(text)
  return(
    <>
      <div className="skill-text subtext2">
        {textDesc.map((text)=>{
          return(
          <div>
            { text.title && (
              <>
                <span className="skill-name highlight-ylw bold1">{text.title}</span>
                <br/>
              </>
            ) }
            {text.description}
              <br/>
              <br/>
          </div>
          ) 
        })}
      </div>
    </>
  )
}

export default SkillDescription