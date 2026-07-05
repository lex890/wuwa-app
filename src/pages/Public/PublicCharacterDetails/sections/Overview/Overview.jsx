
import CharacterInfo from "./components/CharacterInfo/CharacterInfo"
import CharacterImages from "./components/CharacterImages/CharacterImages"

function Overview({ data, tags, assets }) {
  return(
    <>
      <div className="character-overview grid-whole">
        <CharacterInfo data={data} tags={tags} assets={assets}/>
        <CharacterImages data={data}/>
      </div>
    </>
  ) 
}

export default Overview