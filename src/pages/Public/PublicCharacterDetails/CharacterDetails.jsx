import "./index.scss"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import elementColors from "@/constant/colors";
import {
  getCharData,
  Header,
  Overview,
  Stats,
  Skins,
  Skills,
  ErrorPage,
} from "./";



function CharacterDetails() {
  const { characterName } = useParams()
  const [ data, setData ] = useState(null)

  const decCharName = decodeURIComponent(characterName);

  useEffect(() => {
    const loadData = async (name) => {
      const general =
        JSON.parse(localStorage.getItem('wuwa-data')).data.characters;
      const character = general.find(entry => entry.name === name);
      const data = await getCharData(name)
      return {
        character,
        ...data
      }
    }
    loadData(decCharName)
      .then(setData)
      .catch(console.error)
  }, [decCharName])

  if (!data) {
    // skeleton loader here
    return <div className="loading-box">Loading...</div> 
  }

  const { assets, tags, abilities, character, skins } = data

  if ([assets, tags, abilities, character, skins].some(value => value == null)) {
    return ( <ErrorPage /> )
  }

  const theme =  elementColors[character.elemen_type]

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