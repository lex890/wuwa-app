import { Link } from "react-router-dom";
import elementColors from "@/constant/colors";
import defaultImage from '../../../assets/webp/default_image.webp'

import { ElementIcons } from "@/assets/webp/constant/element_small";
import { RarityIcons } from "@/assets/webp/constant/rarity";

function CharacterCard({ character }) {
  const theme =  elementColors[character.elemen_type]

  return(
    <>
    <div className="card" style={{ "--shadow-color": theme}}>
      <Link
        key={character.id}
        to={`/character/${encodeURIComponent(character.name)}`}
        className="char-nav"
      >
        <div className="card-element">
          <img 
            src={ElementIcons[character.elemen_type]} 
            alt={character.elemen_type} 
          />  
        </div>
        <div className="card-quality">
          <img 
            src={RarityIcons[character.quality_id]}
            alt={character.elemen_type} 
          />  
          
        </div> 
        <div className="card-image"style={{ transform: "skew(6deg, 0deg)" }}>
          <img
            src={character.icons?.["FormationRoleCard"] ?? defaultImage}
            alt={character.name}
          />
        </div>
        <div className="card-name">{character.name}</div>
        <div className="card-highlight" style={{ "--shadow-color": theme}}></div>
        <div className="card-shine"></div>
      </Link>
    </div>

    </>
  )
}

export default CharacterCard