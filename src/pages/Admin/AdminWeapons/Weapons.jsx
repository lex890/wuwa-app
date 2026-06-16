import './Weapons.scss'

function Weapons({ data }) {
  console.log('num of data: ', data.length)
  return(
    <>      
      <div className="header-container">
        <h1>Weapons Admin Page</h1>
      </div>
    </>
  )
}

export default Weapons