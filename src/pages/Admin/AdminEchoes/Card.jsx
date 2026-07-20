function Card({ data }) {
  const { id, name, icon_url } = data

  return(
    <div className="card" echo-id={id}>
      <img src={icon_url} alt="" />
      <span>{name}</span>
    </div>
  )
}

export default Card