import './Echoes.scss'

function Echoes({ data }) {
  console.log('num of data: ', data.length)
  return(
    <>      
      <div className="header-container">
        <h1>Echoes Admin Page</h1>
      </div>
    </>
  )
}

export default Echoes