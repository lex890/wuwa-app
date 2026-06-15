function Card({ Icon, name, amount }) {
  return(
    <>
      <div>
        <Icon />
        <div><span>{name}</span></div>
        <div><span>{amount}</span></div>
      </div>
    </>
  )
}

export default Card