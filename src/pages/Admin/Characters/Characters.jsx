import './Characters.scss'

function Characters({ data }) {
  console.log('num of data: ', data.length)
  return(
    <>      
      <div className="char-list">
        <ul>
          {data.map(char => 
            <li>{char.id}</li>
          )}
        </ul>
      </div>
    </>
  )
}

export default Characters