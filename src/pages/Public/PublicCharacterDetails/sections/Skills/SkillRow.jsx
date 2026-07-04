function SkillRow(props) {

  const { stat, level, index } = props
  const { attributeName, values } = stat

  const findVal = () => {
    return values.find((_, index) => index === level - 1)
  }

  return(
    <>
      <div className={`flex-space-between ${index % 2 === 0 ? "row-even" : "row-odd"} chonk white-wrap hidden`}>
        <span className="long-desc flex-start gap hidden">
          <span className="subtext2">{attributeName}</span>
        </span>
        <span className="short-desc subtext2">{findVal()}</span>
      </div>
    </>
  )
}

export default SkillRow