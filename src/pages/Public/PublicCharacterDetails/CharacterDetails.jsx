import { useParams } from "react-router-dom";
import getCharData from "../../../api/getCharData";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Overview from "./Overview";

import "./index.scss"

async function loadData(name) {

  const general =
    JSON.parse(localStorage.getItem('wuwa-character') || '{"data":[]}').data;

  const character = general.find(entry => entry.name === name);

  const data = await getCharData(name)

  return {
    character,
    ...data
  }
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
    return <div>Loading...</div> // skeleton loader here
  }

  const { assets, tags, abilities, character } = data
  console.log(character.id)
  
  return (
    <>
      <Header />
      <Overview data={character} tags={tags}/>
      <div>{character?.id ?? "N/A"}</div>
      <div>{assets?.main_id ?? "N/A"}</div>
      <div>{tags?.main_id ?? "N/A"}</div>
      <div>{abilities?.main_id ?? "N/A"}</div>
    </>
  )
}

export default CharacterDetails