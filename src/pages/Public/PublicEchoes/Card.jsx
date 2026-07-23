function Card(props) {
  const {
    name,
    quality,
    icon_url
  } = props.data
  return(
    <div className="card"> 
      <img src={icon_url} alt="" />
      <span>{name}</span>
    </div>
  )
}

export default Card