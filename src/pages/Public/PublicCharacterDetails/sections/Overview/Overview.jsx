
import CharacterInfo from "./components/CharacterInfo/CharacterInfo"
import CharacterImages from "./components/CharacterImages/CharacterImages"

function Overview({ data, tags, assets, abilities }) {
  console.log(tags)
  return(
    <>
      <div className="character-overview">
        <CharacterInfo data={data} tags={tags} assets={assets} abilities={abilities}/>
        <CharacterImages data={data}/>
      </div>
    </>
  ) 
}

export default Overview