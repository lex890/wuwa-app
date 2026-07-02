import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import getCharData from "../../../api/getCharData";
import Header from "@/components/Header";
import Overview from "./sections/Overview/Overview";
import Stats from "./sections/Stats/Stats";

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
  console.log('logging: ', abilities.stats)

  const elementColors = {
    Aero: "#00ffbf",
    Electro: "#cc00ff",
    Fusion: "#ff3300",
    Glacio: "#00eeff",
    Havoc: "#ff009d",
    Spectro: "#ffe600",
  };

  return (
    <>
      <div style={{"--accent-color": elementColors[character.elemen_type]}}>
        <Header />
        <Overview data={character} tags={tags} assets={assets} abilities={abilities}/>
        <Stats stats={abilities.stats}/>
        <Stats stats={abilities.stats}/>
        <Stats stats={abilities.stats}/>
        {
          /* 
            <div>{character?.id ?? "N/A"}</div>
            <div>{assets?.main_id ?? "N/A"}</div>
            <div>{tags?.main_id ?? "N/A"}</div>
            <div>{abilities?.main_id ?? "N/A"}</div>
          */
        }
      </div>
    </>
  )
}

export default CharacterDetails