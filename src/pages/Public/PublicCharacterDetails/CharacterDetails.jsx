import { useParams } from "react-router-dom";
import getCharData from "../../../api/getCharData";
import { useState, useEffect } from "react";

async function loadData(name) {
  const data = await getCharData(name)
  return data
}

function CharacterDetails() {
  const { characterName } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    loadData(characterName)
      .then(setData)
      .catch(console.error)
  }, [characterName])

  if (!data) {
    return <div>Loading...</div>
  }

  const { assets, tags, abilities } = data
  console.log(data)
  
  return (
    <>
      <div>{assets?.main_id ?? "N/A"}</div>
      <div>{tags?.main_id ?? "N/A"}</div>
      <div>{abilities?.main_id ?? "N/A"}</div>
    </>
  )
}

export default CharacterDetails