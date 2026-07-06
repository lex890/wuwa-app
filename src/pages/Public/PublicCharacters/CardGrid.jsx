import CharacterCard from "./CharacterCard"

function CardGrid({ data }) {
  return(
    <>
      <div id="card-container">
        {data.map((char) => {
          return(
            <>
              <CharacterCard character={char} />
            </>
          )
        })}

      </div>
    </>
  )
}

export default CardGrid