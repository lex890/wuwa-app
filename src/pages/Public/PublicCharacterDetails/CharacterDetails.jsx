import { useParams } from "react-router-dom";

function CharacterDetails({ data }) {
  const { characterName } = useParams();
  console.log('name', characterName)
  console.log('data', data)
  const character = data.find(
    c => c.name === characterName
  );
  console.log(character)
  return(
    <>
    <div>This is character page for {character.name}</div>
    </>
  )
}

export default CharacterDetails