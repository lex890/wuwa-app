import Card from "./Card"

function Section(props) {
  const { icon, name, value } = props
  return(
    <>
      <div className="view-card">
        <span>
          <img src={icon} alt="" />
          <div className="echo-set-name">
            <span>{name}</span>
          </div>
        </span>
        {value.map((echo) => (
          <Card
            key={echo?.id} 
            data={echo}
          /> 
        ))}
      </div>
    </>
  )
}

export default Section