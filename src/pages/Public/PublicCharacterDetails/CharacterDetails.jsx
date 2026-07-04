import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import getCharData from "../../../api/getCharData";
import Header from "@/components/Header";
import Overview from "./sections/Overview/Overview";
import Stats from "./sections/Stats/Stats";
import Skins from "./sections/Skins/Skins";
import Skills from "./sections/Skills/Skills";

import "./index.scss"

async function loadData(name) {

  const general =
    JSON.parse(localStorage.getItem('wuwa-character') || '{"data":[]}').data;

  const character = general.find(entry => entry.name === name);
  console.log('this is selected name: ', name)
  const data = await getCharData(name)

  return {
    character,
    ...data
  }
}

function CharacterDetails() {
  const { characterName } = useParams()
  const [ data, setData ] = useState(null)

  const decCharName = decodeURIComponent(characterName);

  useEffect(() => {
    loadData(decCharName)
      .then(setData)
      .catch(console.error)
  }, [decCharName])

  if (!data) {
    return <div>Loading...</div> // skeleton loader here
  }

  const { assets, tags, abilities, character } = data

  const elementColors = {
    Aero: "#00ffbf",
    Electro: "#cc00ff",
    Fusion: "#ff3300",
    Glacio: "#00eeff",
    Havoc: "#ff009d",
    Spectro: "#ffef5e",
  };

  return (
    <>
      <div className="grid-island" style={{"--accent-color": elementColors[character.elemen_type]}}>
        <Header />
        <Overview data={character} tags={tags} assets={assets} abilities={abilities}/>
        <Stats stats={abilities.stats}/>
        <Skins />
        <Skills skills={abilities.skills}/>
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