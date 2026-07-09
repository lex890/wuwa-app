
const baseURL = 'https://api.encore.moe/resource/Data'

function Tags({ info }) {
  const { TagDesc, TagIcon, TagName } = info
  
  return(
    <>
      <div data-name={TagName}>
        <img src={baseURL + TagIcon} alt={TagName} />
        <div className="tag-tool-tip view-card">
          <h2>{TagName}</h2>
          <span>{TagDesc}</span>
        </div>
      </div>
    </>
  )
}

export default Tags