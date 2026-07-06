import './Weapons.scss'

function Weapons({ data }) {

  return(
    <>      
      <div className="header-container">
        <h1>Weapons Admin Page</h1>
        {
          data.map((weapon)=> {
            return(
              <>
                <div>{weapon.name}</div>
              </>
            )
          })
        }
      </div>
    </>
  )
}

export default Weapons