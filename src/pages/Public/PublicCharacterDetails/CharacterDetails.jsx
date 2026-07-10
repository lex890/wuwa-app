import "./index.scss"
import elementColors from "@/constant/colors";
import useCharacterData from "@/hooks/useCharacterData";
import { useParams } from "react-router-dom";

import {
  Header,
  Overview,
  Stats,
  Skins,
  Skills,
  ErrorPage,
} from "./";

function CharacterDetails() {
  const { characterName } = useParams();
  const { data, loading, error } = useCharacterData(characterName);
  
  if (loading) return <div className="loading-box">Loading...</div>
  if (error) return <ErrorPage /> 

  const { assets, tags, abilities, character, skins } = data

  return (
    <>
      <div id="grid-island" style={{"--accent-color": elementColors[character?.elemen_type]}}>
        <Header />
        <Overview data={character} tags={tags} assets={assets}/>
        <div className="section-card grid-whole flex-center-stretch">
          <Stats stats={abilities?.stats}/>
          <Skins skinData={skins}/>
        </div>
        <Skills skills={abilities?.skills}/>
      </div>
    </>
  )
}

export default CharacterDetails