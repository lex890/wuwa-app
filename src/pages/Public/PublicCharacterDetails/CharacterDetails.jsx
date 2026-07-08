import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import getCharData from "../../../api/getCharData";
import Header from "@/components/Header";
import Overview from "./sections/Overview/Overview";
import Stats from "./sections/Stats/Stats";
import Skins from "./sections/Skins/Skins";
import Skills from "./sections/Skills/Skills";
import ErrorPage from "@/assets/components/ErrorPage";

import "./index.scss"
import elementColors from "@/constant/colors";

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
  const [ data, setData ] = useState(null)

  const decCharName = decodeURIComponent(characterName);

  useEffect(() => {
    loadData(decCharName)
      .then(setData)
      .catch(console.error)
  }, [decCharName])

  if (!data) {
    return <div className="loading-box">Loading...</div> // skeleton loader here
  }

  const { assets, tags, abilities, character, skins } = data

  if ([assets, tags, abilities, character, skins].some(value => value == null)) {
    return ( <ErrorPage /> )
  }

  const theme =  elementColors[character.elemen_type]
  console.log(data)
  return (
    <>
      <div id="grid-island" style={{"--accent-color": theme}}>
        <Header />
        <Overview data={character} tags={tags} assets={assets}/>
        <div className="section-card grid-whole flex-center-stretch">
          <Stats stats={abilities.stats}/>
          <Skins skinData={skins}/>
        </div>
        <Skills skills={abilities.skills}/>
      </div>
    </>
  )
}

export default CharacterDetails