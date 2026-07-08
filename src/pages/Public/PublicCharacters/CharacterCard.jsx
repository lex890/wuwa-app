import { Link } from "react-router-dom";
import elementColors from "@/constant/colors";
import defaultImage from '../../../assets/webp/default_image.webp'

function CharacterCard({ character }) {
  const theme =  elementColors[character.elemen_type]
  return(
    <>
    <div className="card" style={{"border": `1px solid ${theme}`}}>
      <Link
        key={character.id}
        to={`/character/${encodeURIComponent(character.name)}`}
        className="char-nav"
      >
        <div>{character.elemen_type}</div> {/* this is image */}
        <div>{character.quality_id}</div> {/* this is image */}
        <div>
          <img src={character.icons?.["FormationRoleCard"] ?? defaultImage} alt="character.name" />
        </div>
        <div>{character.name}</div>
      </Link>
    </div>

    </>
  )
}

export default CharacterCard