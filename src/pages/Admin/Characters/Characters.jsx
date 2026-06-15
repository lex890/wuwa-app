import './Characters.scss'

function Characters({ data }) {
  console.log('num of data: ', data.length)
  return(
    <>      
      <div className="header-container">
        <h1>Characters Admin Page</h1>
      </div>
    </>
  )
}

export default Characters