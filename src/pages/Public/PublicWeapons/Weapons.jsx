import './index.scss'

function Weapons({ data }) {
  if (!data) {
    return <p>Loading...</p>;
  }
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