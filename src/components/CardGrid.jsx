import CharacterCard from "./CharacterCard"

function CardGrid({ data }) {
  return(
    <>
      <div className="card-grid">
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