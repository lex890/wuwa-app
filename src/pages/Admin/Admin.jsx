function Admin({ data }) {
  console.log(data)
  return(
    <>
      <div>Hi welcome to admin</div>
      <ul>
        {data.map(i => {
          return <li>{i.name}</li>
        })}
      </ul>
    </>

  )
}

export default Admin