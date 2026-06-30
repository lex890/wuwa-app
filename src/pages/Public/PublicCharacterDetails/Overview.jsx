
import CharacterInfo from "./CharacterInfo/CharacterInfo"
import CharacterImages from "./CharacterImages/CharacterImages"
function Overview({ data, tags }) {
  console.log(tags)
  return(
    <>
      <div className="character-overview">
        <CharacterInfo data={data} tags={tags}/>
        <CharacterImages data={data} tags={tags}/>
      </div>
    </>
  ) 
}

export default Overview