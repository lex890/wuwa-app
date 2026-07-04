const baseURL = 'https://api-v2.encore.moe/resource/Data'

function StatRow({ stat, level, index }) {
  const { Icon, Name, GrowthValues } = stat

  const convertPath = (path) => {
    const normalizedPath = path.replace(/uiresources/i, "UIResources");

    const lastDot = normalizedPath.lastIndexOf(".");
    return normalizedPath.slice(0, lastDot) + ".webp";
  }
  const findVal = () => {
    return GrowthValues.find(g => g.level === level)
  }
  const processVal = (value) => {
    if (isNaN(value)) return value
    else return Math.floor(value)
  }

  return(
    <>
      <div className={`flex-space-between ${index % 2 === 0 ? "row-even" : "row-odd"} chonk`}>
        <span className="flex-end gap">
          <img style={{width: "1.5em"}} src={baseURL+convertPath(Icon)} alt={Name} />
          <span className="subtext2 three-dots">{Name}</span>
        </span>
        <span className="subtext2">{processVal(findVal().value)}</span>
      </div>
    </>
  )
}

export default StatRow